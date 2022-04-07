import { useContext } from 'react';
import PaymentMethodFormContext from '../../../../components/paymentMethod/context/PaymentMethodFormContext';

export default function useAmazonPayFormikContext() {
  return useContext(PaymentMethodFormContext);
}
