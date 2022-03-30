import RootElement from '../../../../../utils/rootElement';
import sendRequest, { RESPONSE_JSON } from '../../../../../api/sendRequest';

export default async function restGetPaymentDescriptor(appDispatch, checkoutSessionId) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/payment-descriptor`;

  return sendRequest(appDispatch, {}, url, RESPONSE_JSON, {}, true);
}
