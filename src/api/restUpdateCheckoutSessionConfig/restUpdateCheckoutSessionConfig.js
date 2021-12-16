import sendRequest from '../sendRequest';
import RootElement from '../../../../../utils/rootElement';

export default async function restUpdateCheckoutSessionConfig(
  checkoutSessionId
) {
  const { restUrlPrefix } = RootElement.getPaymentConfig().payment;
  const url = `${restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/update`;

  return sendRequest({}, url);
}
