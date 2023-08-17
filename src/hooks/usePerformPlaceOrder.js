import { useCallback } from 'react';

import { __ } from '@hyva/react-checkout/i18n';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import restUpdateCheckoutSessionConfig from '../api/restUpdateCheckoutSessionConfig';

export default function usePerformPlaceOrder() {
  const { appDispatch, setErrorMessage, setPageLoader } =
    useAmazonPayAppContext();

  return useCallback(
    async (checkoutSessionId) => {
      try {
        setPageLoader(true);
        const updateResponse = await restUpdateCheckoutSessionConfig(
          appDispatch,
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
    [setPageLoader, setErrorMessage, appDispatch]
  );
}
