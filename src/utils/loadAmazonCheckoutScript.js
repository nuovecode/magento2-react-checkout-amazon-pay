import config from './config';

const scriptUrls = {
  amazonPayCheckoutDE: 'https://static-eu.payments-amazon.com/checkout.js',
  amazonPayCheckoutUK: 'https://static-eu.payments-amazon.com/checkout.js',
  amazonPayCheckoutJP: 'https://static-fe.payments-amazon.com/checkout.js',
  amazonPayCheckoutUS: 'https://static-na.payments-amazon.com/checkout.js',
};

function getCheckoutModuleName() {
  switch (config.region) {
    case 'de':
      return scriptUrls.amazonPayCheckoutDE;
    case 'uk':
      return scriptUrls.amazonPayCheckoutUK;
    case 'jp':
      return scriptUrls.amazonPayCheckoutJP;
    case 'us':
    default:
      return scriptUrls.amazonPayCheckoutUS;
  }
}

function injectExeternalScript(url) {
  return new Promise((resolve, reject) => {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.async = true;
    scriptTag.onload = resolve;
    scriptTag.onerror = reject;

    document.body.appendChild(scriptTag);
  });
}

export default async function loadAmazonCheckoutScript() {
  if (window.amazon) {
    return;
  }

  await injectExeternalScript(getCheckoutModuleName());
}
