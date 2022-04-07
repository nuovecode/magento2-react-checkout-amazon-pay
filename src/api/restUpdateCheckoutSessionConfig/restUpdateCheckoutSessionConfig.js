import sendRequest from '../../../../../api/sendRequest';
import RootElement from '../../../../../utils/rootElement';

export default async function restUpdateCheckoutSessionConfig(
  appDispatch,
  checkoutSessionId
) {
  const paymentConfig = RootElement.getPaymentConfig();
  const url = `${paymentConfig.restUrlPrefix}amazon-checkout-session/${checkoutSessionId}/update`;

  return sendRequest(appDispatch, {}, url);
}
