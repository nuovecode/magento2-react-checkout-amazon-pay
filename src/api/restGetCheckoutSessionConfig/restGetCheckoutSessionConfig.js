import RootElement from '../../../../../utils/rootElement';
import modifier from './modifier';
import sendRequest, { RESPONSE_JSON } from '../sendRequest';

export default async function restGetCheckoutSessionConfig() {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/config`;
  return modifier(await sendRequest({}, url, RESPONSE_JSON, {}, true));
}
