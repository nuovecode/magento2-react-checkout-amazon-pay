import { _isObjEmpty } from '@hyva/react-checkout/utils';

export default function restGetCheckoutSessionConfigModifier(result) {
  if (!_isObjEmpty(result)) {
    const sessionConfig = result[0] || {};

    return {
      productType: false,
      sandbox: sessionConfig.sandbox,
      merchantId: sessionConfig.merchant_id,
      ledgerCurrency: sessionConfig.currency,
      buttonColor: sessionConfig.button_color,
      checkoutLanguage: sessionConfig.language,
      publicKeyId: sessionConfig.public_key_id,
      loginPayload: sessionConfig.login_payload,
      loginSignature: sessionConfig.login_signature,
      checkoutPayload: sessionConfig.paynow_payload,
      checkoutSignature: sessionConfig.paynow_signature,
      checkoutReviewPayload: sessionConfig.checkout_payload,
      checkoutReviewSignature: sessionConfig.checkout_signature,
    };
  }

  return {};
}
