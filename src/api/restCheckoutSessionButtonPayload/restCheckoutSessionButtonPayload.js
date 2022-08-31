import modifier from './modifier';
import RootElement from '../../../../../utils/rootElement';
import sendRequest, { RESPONSE_JSON } from '../../../../../api/sendRequest';

export default async function restGetCheckoutSessionButtonPayload(
  appDispatch,
  payloadType
) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/button-payload/${payloadType}`;

  return modifier(
    await sendRequest(appDispatch, {}, url, RESPONSE_JSON, {}, true)
  );
}
