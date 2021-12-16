import { useCallback, useEffect, useState } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { useFormikContext } from 'formik';
import usePerformPlaceOrder from './usePerformPlaceOrder';
import restGetCheckoutSessionConfig from '../api/restGetCheckoutSessionConfig';
import useAmazonPayCartContext from './useAmazonPayCartContext';
import { __ } from '../../../../i18n';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import restGetShippingAddress from '../api/restGetShippingAddress';
import restGetBillingAddress from '../api/restGetBillingAddress';
import {
  AMAZON_NOT_AVL,
  INVALID_BILLING_ADDR_ERR,
  INVALID_SHIPPING_ADDR_ERR,
  parseAddress,
} from '../utils';
import { _cleanObjByKeys, _isObjEmpty, _makePromise } from '../../../../utils';
import {
  SHIPPING_ADDR_FORM,
  LOGIN_FORM,
  PAYMENT_METHOD_FORM,
  BILLING_ADDR_FORM,
} from '../../../../config';
import LocalStorage from '../../../../utils/localStorage';
import useShippingMethodCartContext from '../../../../components/shippingMethod/hooks/useShippingMethodCartContext';
import { getCheckoutSessionId } from '../../../../components/paymentMethod/utility';
import useSuggestedAddress from '../../../../components/shippingAddress/hooks/useSuggestedAddress';
import { setDefaultShippingMethod } from '../../../../components/shippingAddress/utility';
import useSuggestedBillingAddresses from '../../../../components/billingAddress/hooks/useSuggestedBillingAddresses';
import getAndSaveLoqateAddressSuggestions from '../../../../api/loqate/getAndSaveLoqateAddressSuggestions';

const EMAIL_FIELD = `${LOGIN_FORM}.email`;

export default function useAmazonPay(paymentMethodCode) {
  const [processPaymentEnable, setProcessPaymentEnable] = useState(false);

  const {
    selectedPaymentMethod,
    cartId,
    addCartShippingAddress,
    setCartBillingAddress,
  } = useAmazonPayCartContext();
  const {
    setErrorMessage,
    setPageLoader,
    checkoutAgreements,
  } = useAmazonPayAppContext();
  const performPlaceOrder = usePerformPlaceOrder();
  const { setShippingMethod } = useShippingMethodCartContext();
  const { clearSuggestedAddress, saveSuggestedAddress } = useSuggestedAddress();
  const { clearSuggestedBillingAddresses, saveSuggestedBillingAddresses } = useSuggestedBillingAddresses();
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const query = window.location.search;
  const selectedPaymentMethodCode = _get(selectedPaymentMethod, 'code');

  /**
   Set amazon script.
   */
  useEffect(() => {
    if (!window.amazon) {
      const scriptTag = document.createElement('script');

      scriptTag.src = 'https://static-eu.payments-amazon.com/checkout.js';
      scriptTag.async = true;

      document.body.appendChild(scriptTag);
    }
  }, []);

  /**
   Get amazon session config from the BE when the payment is selected
   */
  const getCheckoutSessionConfig = useCallback(async () => {
    if (
      paymentMethodCode === 'amazon_payment_v2' &&
      !getCheckoutSessionId(query ?? '')
    ) {
      setPageLoader(true);
      const config = await restGetCheckoutSessionConfig();
      setPageLoader(false);

      if (!config) {
        throw new Error(__(AMAZON_NOT_AVL));
      }

      if (!window.amazon) {
        throw new Error(__(AMAZON_NOT_AVL));
      }

      window.amazon.Pay.renderButton('#AmazonPayButton', {
        merchantId: config.merchantId,
        publicKeyId: config.publicKeyId,
        ledgerCurrency: config.ledgerCurrency,
        checkoutLanguage: config.checkoutLanguage,
        productType: 'PayAndShip',
        placement: 'Checkout',
        buttonColor: config.buttonColor,
        createCheckoutSessionConfig: {
          payloadJSON: config.checkoutReviewPayload,
          signature: config.checkoutReviewSignature,
        },
        sandbox: config.sandbox,
      });
    }

    return false;
  }, [paymentMethodCode, setPageLoader, query]);

  /**
   Check if is possible to proceed on placing the order.
   */
  useEffect(() => {
    if (query && getCheckoutSessionId(query) && !processPaymentEnable) {
      setProcessPaymentEnable(true);
    }
  }, [
    paymentMethodCode,
    query,
    setProcessPaymentEnable,
    selectedPaymentMethodCode,
    processPaymentEnable,
  ]);

  /**
   Get addresses from amazon pay and set in the checkout
   */
  const setAddresses = useCallback(async () => {
    const checkoutSessionId = getCheckoutSessionId(query);

    if (!checkoutSessionId) {
      return;
    }

    /** Checkout agreement validation because when the checkout agreements initial values are coming
     all the form is reset because the enableReinitialize prop in the formik (CheckoutFormProvider.jsx) */
    if (!checkoutAgreements || _isObjEmpty(checkoutAgreements)) {
      return;
    }

    setPageLoader(true);

    try {
      /** Get Amazon addresses via rest */
      const [shippingAddress] = await restGetShippingAddress(checkoutSessionId);
      const [billingAddress] = await restGetBillingAddress(checkoutSessionId);

      if (!shippingAddress || !billingAddress) {
        setErrorMessage(__(AMAZON_NOT_AVL));
        setPageLoader(false);
        return;
      }

      const isSameAsShipping = billingAddress === shippingAddress;

      /** Parse and validate the shipping address */
      const shippingAddressParsed = parseAddress(shippingAddress, cartId);
      let shippingAddressIsValid = true;

      /** Update the amazon addresses as the customer addresses and run the mutation to save them in the backend */
      let billingAddressResponse;
      const updateShippingAddress = _makePromise(
        addCartShippingAddress,
        shippingAddressParsed,
        isSameAsShipping
      );
      const shippingAddressResponse = await updateShippingAddress().catch(
        () => {
          const shippingAddressToSet = _cleanObjByKeys(shippingAddressParsed, [
            'fullName',
            'cartId',
          ]);
          _set(shippingAddressToSet, 'isSameAsShipping', isSameAsShipping);
          LocalStorage.saveCustomerAddressInfo('', isSameAsShipping);
          setFieldValue(SHIPPING_ADDR_FORM, shippingAddressToSet);
          setErrorMessage(__(INVALID_SHIPPING_ADDR_ERR));
          shippingAddressIsValid = false;
        }
      );

      const shippingAddressToSet = _cleanObjByKeys(shippingAddressParsed, [
        'fullName',
        'cartId',
      ]);

      _set(shippingAddressToSet, 'isSameAsShipping', isSameAsShipping);
      LocalStorage.saveCustomerAddressInfo('', isSameAsShipping);
      setFieldValue(SHIPPING_ADDR_FORM, shippingAddressToSet);

      // attempt to get shipping address suggestions
      clearSuggestedAddress();
      if (shippingAddressToSet.country === 'DE') {
        try {
          await getAndSaveLoqateAddressSuggestions(
              shippingAddressToSet,
              saveSuggestedAddress
          );
        } catch (error) {
          console.error(error);
        }
      }

      /** Parse and validate the billing address */
      const billingAddressParsed = parseAddress(billingAddress, cartId);
      const billingAddressIsValid = true;

      /** Update the billing address and check if there is an error message */
      if (billingAddressIsValid) {
        const updateBillingAddress = _makePromise(
          setCartBillingAddress,
          parseAddress({ ...billingAddress, isSameAsShipping }, cartId),
          isSameAsShipping
        );

        billingAddressResponse = await updateBillingAddress().catch(() => {
          setErrorMessage(__(INVALID_BILLING_ADDR_ERR));
          shippingAddressIsValid = false;
        });
      }

      const billingAddressToSet = _cleanObjByKeys(billingAddressParsed, [
        'fullName',
        'cartId',
      ]);

      _set(billingAddressToSet, 'isSameAsShipping', isSameAsShipping);

      LocalStorage.saveCustomerAddressInfo('', isSameAsShipping, false);
      LocalStorage.saveBillingSameAsShipping(isSameAsShipping);

      setFieldValue(BILLING_ADDR_FORM, billingAddressToSet);

      // attempt to get billing address suggestions
      clearSuggestedBillingAddresses();
      if (billingAddressToSet.country === 'DE') {
        try {
          await getAndSaveLoqateAddressSuggestions(
              billingAddressToSet,
              saveSuggestedBillingAddresses
          );
        } catch (error) {
          console.error(error);
        }
      }

      /** Select the first shipping method by default */
      if (shippingAddressIsValid) {
        const methodList = _get(shippingAddressResponse, 'shipping_methods');
        await setDefaultShippingMethod(methodList, setShippingMethod);

        /** Select the payment method */
        setFieldValue(`${PAYMENT_METHOD_FORM}.code`, 'amazon_payment_v2');
      }

      /** Set the email on cart */
      if (shippingAddressIsValid || billingAddressIsValid) {
        const cartEmail =
          shippingAddressResponse?.email ?? billingAddressResponse?.email;
        setFieldValue(EMAIL_FIELD, cartEmail);
      }

      LocalStorage.saveIsExternalShippingAddress(
        shippingAddressIsValid ? true : 'invalid'
      );
      LocalStorage.saveIsExternalBillingAddress(
        billingAddressIsValid ? true : 'invalid'
      );

      setPageLoader(false);
    } catch (error) {
      console.log({ error });
      setPageLoader(false);
    }
    // eslint-disable-next-line
  }, [
    query,
    addCartShippingAddress,
    cartId,
    setErrorMessage,
    setPageLoader,
    setCartBillingAddress,
    setFieldValue,
    setFieldTouched,
    paymentMethodCode,
    checkoutAgreements,
  ]);

  /**
   Final step: placing the order
   */
  const placeAmazonPayOrder = useCallback(async () => {
    const checkoutSessionId = getCheckoutSessionId(query);

    if (!checkoutSessionId) {
      return;
    }

    await performPlaceOrder(checkoutSessionId);
  }, [query, performPlaceOrder]);

  return {
    placeAmazonPayOrder,
    getCheckoutSessionConfig,
    processPaymentEnable,
    setAddresses,
  };
}
