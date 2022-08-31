import React, { useCallback, useEffect } from 'react';

import { amazonPayLogoUrl } from '../utils';
import useAmazonPay from '../hooks/useAmazonPay';
import { PAYMENT_METHOD_FORM } from '../../../../config';
import { paymentMethodShape } from '../../../../utils/payment';
import useAmazonPayAppContext from '../hooks/useAmazonPayAppContext';
import useAmazonPayCartContext from '../hooks/useAmazonPayCartContext';
import useAmazonPayFormikContext from '../hooks/useAmazonPayFormikContext';
import useAmazonPayCheckoutFormContext from '../hooks/useAmazonPayCheckoutFormContext';
import RadioInput from '../../../../components/common/Form/RadioInput';
import { __ } from '../../../../i18n';

function AmazonPayRenderer({ method, selected }) {
  const methodCode = method.code;
  const { setPageLoader } = useAmazonPayAppContext();
  const { setFieldValue } = useAmazonPayFormikContext();
  const { isVirtualCart, setPaymentMethod, hasCartShippingAddress } =
    useAmazonPayCartContext();
  const { registerPaymentAction } = useAmazonPayCheckoutFormContext();
  const { amazonPayRef, placeAmazonPayOrder, initializeAmazonButton } =
    useAmazonPay(methodCode);
  const isSelected = methodCode === selected.code;
  const isPaymentAvailable = !isVirtualCart && hasCartShippingAddress;

  const paymentSelectionHandler = useCallback(async () => {
    setPageLoader(true);
    setFieldValue(`${PAYMENT_METHOD_FORM}.code`, methodCode);
    await setPaymentMethod(methodCode);
    setPageLoader(false);
  }, [methodCode, setPageLoader, setPaymentMethod, setFieldValue]);

  // Initializing amazon pay button.
  useEffect(() => {
    if (isSelected) {
      initializeAmazonButton();
    }
  }, [isSelected, initializeAmazonButton]);

  // Allow to place order with amazon pay without showing the amazon pay button.
  useEffect(() => {
    registerPaymentAction(methodCode, placeAmazonPayOrder);
  }, [methodCode, placeAmazonPayOrder, registerPaymentAction]);

  const radioLabel = (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      htmlFor={`paymentMethod_${methodCode}`}
      className="inline-block pl-2 cursor-pointer"
    >
      <img src={amazonPayLogoUrl} alt={__('Amazon Pay')} />
    </label>
  );

  return (
    <>
      <RadioInput
        label={radioLabel}
        value={method.code}
        name="paymentMethod"
        checked={isSelected}
        disabled={!isPaymentAvailable}
        onChange={paymentSelectionHandler}
      />
      <div className={isSelected ? 'mt-4 ml-6' : 'hidden h-0'}>
        <div id="AmazonPayButton" ref={amazonPayRef} />
      </div>
    </>
  );
}

AmazonPayRenderer.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};
export default AmazonPayRenderer;
