import { useContext } from 'react';
import { get as _get } from 'lodash-es';

import CartContext from '@hyva/react-checkout/context/Cart/CartContext';
import { isCartAddressValid } from '@hyva/react-checkout/utils/address';

export default function useAmazonPayCartContext() {
  const [cartData, cartActions] = useContext(CartContext);
  const cart = _get(cartData, 'cart');
  const cartId = _get(cartData, 'cart.id');
  const isVirtualCart = _get(cartData, 'cart.isVirtualCart');
  const cartBillingAddress = _get(cart, `billing_address`) || {};
  const cartShippingAddress = _get(cart, `shipping_address`) || {};
  const selectedPaymentMethod = _get(cart, 'selected_payment_method') || {};
  const selectedShippingMethod = _get(cart, 'selected_shipping_method') || {};
  const hasCartBillingAddress = isCartAddressValid(cartBillingAddress);
  const hasCartShippingAddress = isCartAddressValid(cartShippingAddress);
  const { setPaymentMethod, addCartShippingAddress, setCartBillingAddress } =
    cartActions;

  return {
    cartId,
    isVirtualCart,
    setPaymentMethod,
    cartBillingAddress,
    cartShippingAddress,
    selectedPaymentMethod,
    hasCartBillingAddress,
    setCartBillingAddress,
    hasCartShippingAddress,
    selectedShippingMethod,
    addCartShippingAddress,
  };
}
