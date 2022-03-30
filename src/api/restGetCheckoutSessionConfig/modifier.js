import { _isObjEmpty } from '../../../../../utils';

export default function restGetCheckoutSessionConfig(result) {
  if (!_isObjEmpty(result)) {
    return {
      merchantId: result[0].merchant_id,
      ledgerCurrency: result[0].currency,
      buttonColor: result[0].button_color,
      checkoutLanguage: result[0].language,
      productType: false,
      sandbox: result[0].sandbox,
      loginPayload: result[0].login_payload,
      loginSignature: result[0].login_signature,
      checkoutReviewPayload: result[0].checkout_payload,
      checkoutReviewSignature: result[0].checkout_signature,
      checkoutPayload: result[0].paynow_payload,
      checkoutSignature: result[0].paynow_signature,
      publicKeyId: result[0].public_key_id,
    };
  }
  return {};
}
