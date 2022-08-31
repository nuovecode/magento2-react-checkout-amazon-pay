import React from 'react';

import AmazonPayRenderer from './AmazonPayRenderer';
import config from '../utils/config';
import storage from '../utils/storage';

function AmazonPay(props) {
  if (
    config.hasRestrictedProducts ||
    (!storage.isAmazonCheckout() && !config.isMethodAvailable)
  ) {
    return null;
  }

  return <AmazonPayRenderer {...props} />;
}

export default AmazonPay;
