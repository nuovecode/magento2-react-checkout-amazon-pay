import RootElement from '@hyva/react-checkout/utils/rootElement';
import sendRequest, {
  RESPONSE_JSON,
} from '@hyva/react-checkout/api/sendRequest';
import modifier from './modifier';

export default async function restGetCheckoutSessionConfig(appDispatch) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/config`;
  return modifier(
    await sendRequest(appDispatch, {}, url, RESPONSE_JSON, {}, true)
  );
}
