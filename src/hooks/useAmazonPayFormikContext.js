import { useContext } from 'react';

import { PaymentMethodFormContext } from '../../../../context/Form';

export default function useAmazonPayFormikContext() {
  return useContext(PaymentMethodFormContext);
}
