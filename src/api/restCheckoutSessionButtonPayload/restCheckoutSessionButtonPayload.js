import sendRequest, {
  RESPONSE_JSON,
} from '@hyva/react-checkout/api/sendRequest';
import RootElement from '@hyva/react-checkout/utils/rootElement';
import modifier from './modifier';

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
