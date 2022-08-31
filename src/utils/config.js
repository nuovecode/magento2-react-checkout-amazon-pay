import RootElement from '../../../../utils/rootElement';

const paymentConfig = RootElement.getPaymentConfig();
const amazonPayConfig = paymentConfig.amazonPay || {};

const config = {
  region: amazonPayConfig.region,
  isMethodAvailable: amazonPayConfig.is_method_available,
  hasRestrictedProducts: amazonPayConfig.has_restricted_products,
};

export default config;
