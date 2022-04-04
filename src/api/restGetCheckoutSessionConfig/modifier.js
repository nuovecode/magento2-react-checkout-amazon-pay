import { _isObjEmpty } from '../../../../../utils';

export default function restGetCheckoutSessionConfig(result) {
  if (!_isObjEmpty(result)) {
    const sessionConfig = result[0] || {};
    return {
      merchantId: sessionConfig.merchant_id,
      ledgerCurrency: sessionConfig.currency,
      buttonColor: sessionConfig.button_color,
      checkoutLanguage: sessionConfig.language,
      productType: false,
      sandbox: sessionConfig.sandbox,
      loginPayload: sessionConfig.login_payload,
      loginSignature: sessionConfig.login_signature,
      checkoutReviewPayload: sessionConfig.checkout_payload,
      checkoutReviewSignature: sessionConfig.checkout_signature,
      checkoutPayload: sessionConfig.paynow_payload,
      checkoutSignature: sessionConfig.paynow_signature,
      publicKeyId: sessionConfig.public_key_id,
    };
  }
  return {};
}
