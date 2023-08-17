import RootElement from '@hyva/react-checkout/utils/rootElement';
import sendRequest, {
  RESPONSE_JSON,
} from '@hyva/react-checkout/api/sendRequest';

export default async function restGetShippingAddress(
  appDispatch,
  checkoutSessionId
) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/shipping-address`;

  return sendRequest(appDispatch, {}, url, RESPONSE_JSON, {}, true);
}
