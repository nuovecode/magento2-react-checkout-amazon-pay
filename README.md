# Hyvä Themes - React Checkout Amazon Pay

[![Hyvä Themes](https://github.com/hyva-themes/magento2-react-checkout/blob/documentation/docs/images/logo-hyva.svg)](https://hyva.io/)

## hyva-themes/magento2-react-checkout-amazon-pay

Amazon Pay payment method for Hyvä React Checkout

## Prerequisites

1. **[React Checkout](https://github.com/hyva-themes/magento2-react-checkout)** is installed and setup.
2. Amazon Pay for Magento 2 is installed and setup. `composer require amzn/amazon-pay-magento-2-module "~5.9"`
3. Amazon Pay is configured in the Magento 2 store backend under `Stores > Configuration > Sales > Payment Methods > Other Payment Methods > Amazon Pay`.

## How to use it with Hyvä Checkout?
Add below code in your `package.json`.

File: `src/reactapp/package.json`

```
"config": {
    "paymentMethodsRepo": {
      "amazon_payment_v2": "git@github.com:hyva-themes/magento2-react-checkout-amazon-pay.git"
    }
},
```
With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the React Checkout and configured correctly.

Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of React Checkout react app (`src/reactapp`). After this, if you navigate to the checkout page from your site, then you will see the paypal express payment option you have configured in the above step.

## Documentation

- If you need information on the build process of the React Checkout, then you can **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/payment-integration/)**.
- The official documentation of **[Hyvä React Checkout](https://hyva-themes.github.io/magento2-react-checkout)**
- The Magento module documentation of **[Amazon Pay](https://github.com/amzn/amazon-payments-magento-2-plugin)**

## Credits

Special thanks to Webvisum for building the initial release of this Paypal integration for the Hyvä React Checkout!

# [![webvisum GmbH](https://webvisum.de/media/logo/websites/1/logo.png)](https://webvisum.de)

- [All Contributors][link-contributors]

## License

BSD 3-Clause License. Please see [License File](LICENSE.txt) for more information.

[link-contributors]: ../../contributors
