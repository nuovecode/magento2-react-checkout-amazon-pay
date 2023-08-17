import { useContext } from 'react';
import CheckoutFormContext from '@hyva/react-checkout/context/Form/CheckoutFormContext';

export default function useAmazonPayCheckoutFormContext() {
  return useContext(CheckoutFormContext);
}
