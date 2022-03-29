import RootElement from '../../../../utils/rootElement';

export const parseAddress = (amazonAddress, cartId) => {
  const addressFields = RootElement.getAddressConfig();
  const prefixSelected = addressFields?.prefix?.options[0].value ?? 'Female';
  const street =
    amazonAddress.street.length > 1
      ? [amazonAddress.street.join(', ')]
      : amazonAddress.street;

  return {
    cartId,
    city: amazonAddress.city,
    company: amazonAddress.company ?? '',
    country: amazonAddress.country_id,
    firstname: amazonAddress.firstname,
    lastname: amazonAddress.lastname,
    fullName: `${amazonAddress.firstname} ${amazonAddress.lastname}`,
    phone: amazonAddress.telephone,
    region: amazonAddress.region_code,
    street,
    zipcode: amazonAddress.postcode,
    prefix: prefixSelected,
    isSameAsShipping: amazonAddress.isSameAsShipping,
  };
};

export const getCheckoutSessionId = (query) => {
  const params = new URLSearchParams(query);
  return params.get('amazonCheckoutSessionId');
};

export const INVALID_SHIPPING_ADDR_ERR =
  'The shipping address you have set on Amazon is not valid for the current store, please set another address';

export const INVALID_BILLING_ADDR_ERR =
  'The billing address you have set on Amazon is not valid for the current store, please set another address';

export const AMAZON_NOT_AVL = 'Amazon pay not available';
