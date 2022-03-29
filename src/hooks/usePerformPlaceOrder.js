import { useCallback } from 'react';
import { __ } from '../../../../i18n';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import restUpdateCheckoutSessionConfig from '../api/restUpdateCheckoutSessionConfig';
import LocalStorage from '../../../../utils/localStorage';

export default function usePerformPlaceOrder() {
  const { setErrorMessage, setPageLoader } = useAmazonPayAppContext();

  return useCallback(
    async (checkoutSessionId) => {
      try {
        setPageLoader(true);
        const updateResponse = await restUpdateCheckoutSessionConfig(
          checkoutSessionId
        );

        if (updateResponse && updateResponse.length > 0) {
          LocalStorage.clearCheckoutStorage();
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
    [setPageLoader, setErrorMessage]
  );
}
