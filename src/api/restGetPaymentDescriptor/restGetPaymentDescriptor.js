import RootElement from '../../../../../utils/rootElement';
import sendRequest, { RESPONSE_JSON } from '../sendRequest';

export default async function restGetPaymentDescriptor(checkoutSessionId) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/payment-descriptor`;

  return sendRequest({}, url, RESPONSE_JSON, {}, true);
}
