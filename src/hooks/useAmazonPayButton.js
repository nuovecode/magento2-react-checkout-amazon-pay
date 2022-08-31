import { useCallback, useEffect, useState } from 'react';

import { amazonPayLocalStorage } from '../utils';
import useAmazonPayAppContext from './useAmazonPayAppContext';
import useAmazonPayCartContext from './useAmazonPayCartContext';
import restGetCheckoutSessionButtonPayload from '../api/restCheckoutSessionButtonPayload';

export default function useAmazonPayButton({ sessionConfig }) {
  const [amazonPayButton, setAmazonPayButton] = useState();
  const { appDispatch } = useAmazonPayAppContext();
  const { hasCartBillingAddress } = useAmazonPayCartContext();

  const amazonPayButtonClickHandler = useCallback(async () => {
    if (amazonPayLocalStorage.amazonPayOnly && !hasCartBillingAddress) {
      return;
    }
    const buttonPayload = await restGetCheckoutSessionButtonPayload(
      appDispatch,
      'paynow'
    );
    buttonPayload.publicKeyId = sessionConfig.publicKeyId;

    amazonPayButton.initCheckout(buttonPayload);
  }, [
    appDispatch,
    amazonPayButton,
    hasCartBillingAddress,
    sessionConfig?.publicKeyId,
  ]);

  const amazonPayRef = useCallback(
    (button) => {
      if (!button || !sessionConfig) {
        return;
      }

      setAmazonPayButton(
        window.amazon.Pay.renderButton(`#${button.id}`, {
          placement: 'Checkout',
          productType: 'PayAndShip',
          sandbox: sessionConfig.sandbox,
          merchantId: sessionConfig.merchantId,
          publicKeyId: sessionConfig.publicKeyId,
          buttonColor: sessionConfig.buttonColor,
          ledgerCurrency: sessionConfig.ledgerCurrency,
          checkoutLanguage: sessionConfig.checkoutLanguage,
        })
      );
    },
    [sessionConfig]
  );

  // Appending click handler to amazon pay button.
  useEffect(() => {
    if (amazonPayButton) {
      amazonPayButton.onClick(amazonPayButtonClickHandler);
    }
  }, [amazonPayButton, amazonPayButtonClickHandler]);

  return { amazonPayRef, amazonPayButtonClickHandler };
}
