import { useCallback, useEffect, useState } from 'react';
import _get from 'lodash.get';
import usePerformPlaceOrder from './usePerformPlaceOrder';
import restGetCheckoutSessionConfig from '../api/restGetCheckoutSessionConfig';
import useAmazonPayCartContext from './useAmazonPayCartContext';

/*
 Utility to get the token and the payer id from the URL
 */
const getCheckoutSessionId = query => {
  const params = new URLSearchParams(query);
  return params.get('amazonCheckoutSessionId');
};

export default function useAmazonPay(paymentMethodCode) {
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);
  const [processPaymentEnable, setProcessPaymentEnable] = useState(false);
  const {
    selectedShippingMethod,
    selectedPaymentMethod,
    hasCartBillingAddress,
  } = useAmazonPayCartContext();

  const query = window.location.search;

  const selectedShippingMethodCode = _get(selectedShippingMethod, 'methodCode');
  const selectedPaymentMethodCode = _get(selectedPaymentMethod, 'code');

  /*
   Check if is possible to proceed on placing the order.
   */
  useEffect(() => {
    if (
      query &&
      selectedShippingMethodCode &&
      ['', paymentMethodCode].includes(selectedPaymentMethodCode)
    )
      setProcessPaymentEnable(true);
  }, [
    paymentMethodCode,
    query,
    setProcessPaymentEnable,
    selectedShippingMethodCode,
    selectedPaymentMethodCode,
  ]);

  const placeAmazonPayOrder = useCallback(async () => {
    const checkoutSessionId = getCheckoutSessionId(query);

    if (
      !checkoutSessionId ||
      !selectedShippingMethod ||
      !hasCartBillingAddress
    ) {
      return;
    }

    await performPlaceOrder(checkoutSessionId);
  }, [query, selectedShippingMethod, hasCartBillingAddress, performPlaceOrder]);

  const getCheckoutSessionConfig = useCallback(async () => {
    if (paymentMethodCode === 'amazon_payment_v2') {
      const config = await restGetCheckoutSessionConfig();
      window.amazon.Pay.renderButton('#AmazonPayButton', {
        // set checkout environment
        merchantId: config.merchantId,
        publicKeyId: config.publicKeyId,
        ledgerCurrency: config.ledgerCurrency,
        // customize the buyer experience
        checkoutLanguage: config.checkoutLanguage,
        productType: 'PayAndShip',
        placement: 'Checkout',
        buttonColor: config.buttonColor,
        // configure Create Checkout Session request
        createCheckoutSessionConfig: {
          payloadJSON: config.checkoutReviewPayload,
          signature: config.checkoutReviewSignature,
        },
        sandbox: config.sandbox,
      });
    }

    return false;
  }, [paymentMethodCode]);

  return {
    placeAmazonPayOrder,
    getCheckoutSessionConfig,
    processPaymentEnable,
  };
}
