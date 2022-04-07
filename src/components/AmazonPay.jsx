import { func, shape, string } from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import _get from 'lodash.get';
import RadioInput from '../../../../components/common/Form/RadioInput';
import useAmazonPay from '../hooks/useAmazonPay';
import useAmazonPayCheckoutFormContext from '../hooks/useAmazonPayCheckoutFormContext';
import useAmazonPayCartContext from '../hooks/useAmazonPayCartContext';
import useAmazonPayAppContext from '../hooks/useAmazonPayAppContext';

function AmazonPay({ method, selected, actions }) {
  const methodCode = _get(method, 'code');
  const {
    getCheckoutSessionConfig,
    placeAmazonPayOrder,
    processPaymentEnable,
    setAddresses,
  } = useAmazonPay(methodCode);
  const { setPaymentMethod, selectedPaymentMethod } = useAmazonPayCartContext();
  const { setPageLoader } = useAmazonPayAppContext();
  const isSelected = methodCode === selected.code;
  const { registerPaymentAction } = useAmazonPayCheckoutFormContext();

  const initalizeAmazonPaymentOnSelection = useCallback(async () => {
    setPageLoader(true);
    await getCheckoutSessionConfig();
    if (selectedPaymentMethod.code !== methodCode) {
      await setPaymentMethod(methodCode);
    }
    setPageLoader(false);
  }, [
    setPageLoader,
    getCheckoutSessionConfig,
    selectedPaymentMethod,
    methodCode,
    setPaymentMethod,
  ]);

  useEffect(() => {
    if (isSelected) {
      initalizeAmazonPaymentOnSelection();
    }
  }, [isSelected, initalizeAmazonPaymentOnSelection]);

  useEffect(() => {
    if (processPaymentEnable) {
      setAddresses();
      registerPaymentAction(methodCode, placeAmazonPayOrder);
    }
  }, [
    setAddresses,
    processPaymentEnable,
    methodCode,
    registerPaymentAction,
    placeAmazonPayOrder,
  ]);

  if (isSelected) {
    return (
      <>
        <RadioInput
          label={method.title}
          name="paymentMethod"
          value={method.code}
          onChange={actions.change}
          checked={isSelected}
        />
        <div id="AmazonPayButton" />
      </>
    );
  }

  return (
    <div className="w-full">
      <div>
        <RadioInput
          label={_get(method, 'title')}
          name="paymentMethod"
          value={_get(method, 'code')}
          onChange={actions.change}
          checked={isSelected}
        />
      </div>
    </div>
  );
}

const methodShape = shape({
  title: string,
  code: string.isRequired,
});

AmazonPay.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

AmazonPay.defaultProps = {
  actions: {},
};

export default AmazonPay;
