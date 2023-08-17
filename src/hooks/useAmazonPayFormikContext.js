import { useContext } from 'react';

import { PaymentMethodFormContext } from '@hyva/react-checkout/context/Form';

export default function useAmazonPayFormikContext() {
  return useContext(PaymentMethodFormContext);
}
