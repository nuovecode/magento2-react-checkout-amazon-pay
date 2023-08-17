import { _isObjEmpty } from '@hyva/react-checkout/utils';

export default function restGetCheckoutSessionButtonPayloadModifier(result) {
  let initCheckoutPayload = {};

  if (!_isObjEmpty(result)) {
    initCheckoutPayload = {
      createCheckoutSessionConfig: {
        payloadJSON: result[0],
        signature: result[1],
      },
    };
  }

  return initCheckoutPayload;
}
