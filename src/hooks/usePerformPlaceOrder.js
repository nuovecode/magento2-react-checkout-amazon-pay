import { useCallback } from 'react';
import { __ } from '../../../../i18n';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import useAmazonPayCartContext from './useAmazonPayCartContext';
import restUpdateCheckoutSessionConfig from '../api/restUpdateCheckoutSessionConfig';

export default function usePerformPlaceOrder(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = useAmazonPayAppContext();
  const { setPaymentMethod } = useAmazonPayCartContext();

  return useCallback(
    async checkoutSessionId => {
      try {
        setPageLoader(true);
        await setPaymentMethod({ code: paymentMethodCode });
        const updateResponse = await restUpdateCheckoutSessionConfig(
          checkoutSessionId
        );

        if (updateResponse && updateResponse.length > 0) {
          window.location.href = updateResponse;
        }

        setPageLoader(false);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          __(
            'This transaction could not be performed. Please select another payment method.'
          )
        );
        setPageLoader(false);
      }
    },
    [paymentMethodCode, setPageLoader, setErrorMessage, setPaymentMethod]
  );
}
