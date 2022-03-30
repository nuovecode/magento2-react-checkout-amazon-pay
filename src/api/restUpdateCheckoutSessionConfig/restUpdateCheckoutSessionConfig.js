import sendRequest from '../sendRequest';
import RootElement from '../../../../../utils/rootElement';

export default async function restUpdateCheckoutSessionConfig(
  checkoutSessionId
) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/update`;

  return sendRequest({}, url);
}
