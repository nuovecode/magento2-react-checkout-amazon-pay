import { get as _get, set as _set } from 'lodash-es';

let storageData = null;

function getStorage() {
  if (typeof window === 'undefined') {
    return {};
  }

  storageData = JSON.parse(
    window.localStorage.getItem('amzn-checkout-session') || '{}'
  );

  return storageData;
}

const storage = {
  isAmazonCheckout() {
    return typeof this.getCheckoutSessionId() === 'string';
  },

  getCheckoutSessionId() {
    let sessionId = _get(getStorage(), 'id');
    const param = 'amazonCheckoutSessionId';

    const myParams = new URLSearchParams(window.location.search);
    if (myParams.has(param)) {
      const paramSessionId = myParams.get(param);
      if (typeof sessionId === 'undefined' || paramSessionId !== sessionId) {
        sessionId = paramSessionId;
        _set(storageData, 'id', sessionId);
      }
    }
    return sessionId;
  },
};

export default storage;
