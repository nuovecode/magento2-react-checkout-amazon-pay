export default function restGetCheckoutSessionConfig(result) {
  return {
    merchantId: result[0],
    ledgerCurrency: result[1],
    buttonColor: result[2],
    checkoutLanguage: result[3],
    productType: result[4],
    sandbox: result[5],
    loginPayload: result[6],
    loginSignature: result[7],
    checkoutReviewPayload: result[8],
    checkoutReviewSignature: result[9],
    checkoutPayload: result[10],
    checkoutSignature: result[11],
    publicKeyId: result[12],
  };
}
