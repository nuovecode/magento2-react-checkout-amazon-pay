import { func, shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import _get from 'lodash.get';
import RadioInput from '../../../../components/common/Form/RadioInput';
import useAmazonPay from '../hooks/useAmazonPay';
import useAmazonPayCheckoutFormContext from '../hooks/useAmazonPayCheckoutFormContext';
import usePaymentMethodCartContext from '../../../../components/paymentMethod/hooks/usePaymentMethodCartContext';
import usePaymentMethodAppContext from '../../../../components/paymentMethod/hooks/usePaymentMethodAppContext';

function AmazonPay({ method, selected, actions }) {
  const methodCode = _get(method, 'code');
  const {
    getCheckoutSessionConfig,
    placeAmazonPayOrder,
    processPaymentEnable,
    setAddresses,
  } = useAmazonPay(methodCode);
  const { setPaymentMethod, selectedPaymentMethod } =
    usePaymentMethodCartContext();
  const { setPageLoader } = usePaymentMethodAppContext();
  const isSelected = methodCode === selected.code;
  const { registerPaymentAction } = useAmazonPayCheckoutFormContext();

  useEffect(() => {
    if (isSelected) {
      (async () => {
        setPageLoader(true);
        await getCheckoutSessionConfig();
        if (selectedPaymentMethod.code !== methodCode) {
          await setPaymentMethod(methodCode);
        }
        setPageLoader(false);
      })();
    }
  }, [
    isSelected,
    setPaymentMethod,
    methodCode,
    selectedPaymentMethod,
    setPageLoader,
    getCheckoutSessionConfig,
  ]);

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
  actions: null,
};

export default AmazonPay;
