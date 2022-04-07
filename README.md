# Hyvä Themes - Hyvä Checkout Amazon Pay

[![Hyvä Themes](https://repository-images.githubusercontent.com/303806175/a3973c80-479c-11eb-8716-03e369d87143)](https://hyva.io/)

## hyva-themes/magento2-hyva-checkout-amazon-pay

Amazon Pay payment method for Hyvä Checkout

## Prerequisites

1. **[Hyvä Checkout](https://github.com/hyva-themes/magento2-hyva-checkout)** is installed and setup.
2. Amazon Pay for Magento 2 is installed and setup. `composer require amzn/amazon-pay-magento-2-module "~5.9"`
3. Amazon Pay is configured in the Magento 2 store backend under `Stores > Configuration > Sales > Payment Methods > Other Payment Methods > Amazon Pay`.

## How to use it with Hyvä Checkout?
Add below code in your `package.json`.

File: `src/reactapp/package.json`

```
"config": {
    "paymentMethodsRepo": {
      "amazon_payment_v2": "git@github.com:hyva-themes/magento2-hyva-checkout-amazon-pay.git"
    }
},
```
With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the Hyvä Checkout and configured correctly.

Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of Hyvä Checkout react app (`src/reactapp`). After this, if you navigate to the checkout page from your site, then you will see the paypal express payment option you have configured in the above step.

## Documentation

- If you have any doubts about the building the react app, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-hyva-checkout/payment-integration/)**.
- The official documentation of **[Hyvä Checkout](https://hyva-themes.github.io/magento2-hyva-checkout)**
- The Magento module documentation of **[Amazon Pay](https://github.com/amzn/amazon-payments-magento-2-plugin)**

## Credits

# [![webvisum GmbH](https://webvisum.de/media/logo/websites/1/logo.png)](https://webvisum.de)

- [All Contributors][link-contributors]

## License

BSD 3-Clause License. Please see [License File](LICENSE.txt) for more information.

[link-contributors]: ../../contributors
