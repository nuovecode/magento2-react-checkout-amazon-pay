import { useCallback, useState } from 'react';

import { __ } from '@hyva/react-checkout/i18n';
import { AMAZON_NOT_AVL } from '../utils';
import useAmazonPayButton from './useAmazonPayButton';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import loadAmazonCheckoutScript from '../utils/loadAmazonCheckoutScript';
import restGetCheckoutSessionConfig from '../api/restGetCheckoutSessionConfig';

export default function useAmazonPay() {
  const [sessionConfig, setSessionConfig] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { appDispatch, setPageLoader } = useAmazonPayAppContext();
  const { amazonPayRef, amazonPayButtonClickHandler } = useAmazonPayButton({
    sessionConfig,
  });

  /**
   Get amazon session config from the BE when the payment is selected
   */
  const getCheckoutSessionConfig = useCallback(async () => {
    if (sessionConfig) {
      return;
    }

    const config = await restGetCheckoutSessionConfig(appDispatch);

    if (!config) {
      throw new Error(__(AMAZON_NOT_AVL));
    }

    if (!window.amazon) {
      throw new Error(__(AMAZON_NOT_AVL));
    }

    setSessionConfig(config);
  }, [appDispatch, sessionConfig]);

  const initializeAmazonButton = useCallback(async () => {
    if (isInitialized) {
      return;
    }

    try {
      setPageLoader(true);
      await loadAmazonCheckoutScript();
      await getCheckoutSessionConfig();
      setIsInitialized(true);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoader(false);
    }
  }, [setPageLoader, isInitialized, getCheckoutSessionConfig]);

  return {
    amazonPayRef,
    initializeAmazonButton,
    getCheckoutSessionConfig,
    placeAmazonPayOrder: amazonPayButtonClickHandler,
  };
}
