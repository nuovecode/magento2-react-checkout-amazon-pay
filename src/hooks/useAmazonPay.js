import { useCallback, useEffect, useState } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';
import useAmazonPayFormikContext from './useAmazonPayFormikContext';
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
  getCheckoutSessionId,
} from '../utils';
import { _cleanObjByKeys, _isObjEmpty, _makePromise } from '../../../../utils';
import {
  SHIPPING_ADDR_FORM,
  LOGIN_FORM,
  PAYMENT_METHOD_FORM,
  BILLING_ADDR_FORM,
} from '../../../../config';
import LocalStorage from '../../../../utils/localStorage';

const EMAIL_FIELD = `${LOGIN_FORM}.email`;

export default function useAmazonPay(paymentMethodCode) {
  const [processPaymentEnable, setProcessPaymentEnable] = useState(false);
  const {
    selectedPaymentMethod,
    cartId,
    addCartShippingAddress,
    setCartBillingAddress,
  } = useAmazonPayCartContext();
  const { appDispatch, setErrorMessage, setPageLoader, checkoutAgreements } =
    useAmazonPayAppContext();
  const performPlaceOrder = usePerformPlaceOrder();
  const { setFieldValue, setFieldTouched } = useAmazonPayFormikContext();

  const searchQuery = window.location.search;
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
      !getCheckoutSessionId(searchQuery ?? '')
    ) {
      setPageLoader(true);
      const config = await restGetCheckoutSessionConfig(appDispatch);
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
  }, [paymentMethodCode, setPageLoader, searchQuery]);

  /**
   Check if is possible to proceed on placing the order.
   */
  useEffect(() => {
    if (
      searchQuery &&
      getCheckoutSessionId(searchQuery) &&
      !processPaymentEnable
    ) {
      setProcessPaymentEnable(true);
    }
  }, [
    paymentMethodCode,
    searchQuery,
    setProcessPaymentEnable,
    selectedPaymentMethodCode,
    processPaymentEnable,
  ]);

  /**
   Get addresses from amazon pay and set in the checkout
   */
  const setAddresses = useCallback(async () => {
    const checkoutSessionId = getCheckoutSessionId(searchQuery);

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
      const [shippingAddress, billingAddress] = await Promise.all([
        restGetShippingAddress(appDispatch, checkoutSessionId),
        restGetBillingAddress(appDispatch, checkoutSessionId),
      ]);

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

      const shippingAddressResponse = async () => {
        try {
          await updateShippingAddress();
        } catch (error) {
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
      };

      const shippingAddressToSet = _cleanObjByKeys(shippingAddressParsed, [
        'fullName',
        'cartId',
      ]);

      _set(shippingAddressToSet, 'isSameAsShipping', isSameAsShipping);
      LocalStorage.saveCustomerAddressInfo('', isSameAsShipping);
      setFieldValue(SHIPPING_ADDR_FORM, shippingAddressToSet);

      /** Parse and validate the billing address */
      const billingAddressParsed = parseAddress(billingAddress, cartId);
      const billingAddressIsValid = true;

      /** Update the billing address and check if there is an error message */
      if (billingAddressIsValid && !isSameAsShipping) {
        const updateBillingAddress = _makePromise(
          setCartBillingAddress,
          parseAddress({ ...billingAddress, isSameAsShipping }, cartId),
          isSameAsShipping
        );

        billingAddressResponse = async () => {
          try {
            await updateBillingAddress();
          } catch (error) {
            setErrorMessage(__(INVALID_BILLING_ADDR_ERR));
            shippingAddressIsValid = false;
          }
        };
      }

      const billingAddressToSet = _cleanObjByKeys(billingAddressParsed, [
        'fullName',
        'cartId',
      ]);

      _set(billingAddressToSet, 'isSameAsShipping', isSameAsShipping);

      LocalStorage.saveCustomerAddressInfo('', isSameAsShipping, false);
      LocalStorage.saveBillingSameAsShipping(isSameAsShipping);

      setFieldValue(BILLING_ADDR_FORM, billingAddressToSet);

      if (shippingAddressIsValid) {
        /** Select the payment method */
        setFieldValue(`${PAYMENT_METHOD_FORM}.code`, 'amazon_payment_v2');
      }

      /** Set the email on cart */
      if (shippingAddressIsValid || billingAddressIsValid) {
        const cartEmail =
          shippingAddressResponse?.email ?? billingAddressResponse?.email;
        setFieldValue(EMAIL_FIELD, cartEmail);
      }
      setPageLoader(false);
    } catch (error) {
      console.error({ error });
      setPageLoader(false);
    }
    // eslint-disable-next-line
  }, [
    searchQuery,
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
    const checkoutSessionId = getCheckoutSessionId(searchQuery);

    if (!checkoutSessionId) {
      return;
    }

    await performPlaceOrder(checkoutSessionId);
  }, [searchQuery, performPlaceOrder]);

  return {
    placeAmazonPayOrder,
    getCheckoutSessionConfig,
    processPaymentEnable,
    setAddresses,
  };
}
