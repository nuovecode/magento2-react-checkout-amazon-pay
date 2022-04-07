import RootElement from '../../../../../utils/rootElement';
import modifier from './modifier';
import sendRequest, { RESPONSE_JSON } from '../../../../../api/sendRequest';

export default async function restGetCheckoutSessionConfig(appDispatch) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/config`;
  return modifier(
    await sendRequest(appDispatch, {}, url, RESPONSE_JSON, {}, true)
  );
}
