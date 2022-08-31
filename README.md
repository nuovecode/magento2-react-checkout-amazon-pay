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
      "amazonPay": "git@github.com:hyva-themes/magento2-react-checkout-amazon-pay.git"
    }
},
```
With this code in `package.json` and running `npm install`, then you are all set. This repo will be copied into the React Checkout and configured correctly.

Finally, we need to build the app again. For this, you need to run `npm run build` from the root directory of React Checkout react app (`src/reactapp`). After this, if you navigate to the checkout page from your site, then you will see the Amazon Pay payment option you have configured in the above step.

## Pass Amazon Pay configuration to Hyvä React Checkout

It is important to pass the amazon pay related checkout configurations to the `CheckoutConfigProvider` ViewModel. You can use the module https://github.com/rajeev-k-tomy/hyva-react-checkout-amazon-pay for this purpose or try to implement it by your own way.

## Translations

In order to incorparate translations related to this payment integration, update react app traslation directory `src/i18n` with necessary translations provided inside `i18n` directory.

Along with that, add below code in the layout xml file given below:

File: `src/view/frontend/layout/hyvareactcheckout_reactcheckout_index.`xml`

```
<?xml version="1.0"?>
<page>
    ...
    <body>
        ...
        <referenceContainer name="main" htmlClass="container column main">
            <referenceContainer name="content">
                <referenceBlock name="checkout.translations">
                    <arguments>
                        <argument name="checkout_translations" xsi:type="array">
                            <item name="hyva_reactcheckout_amazon_pay" xsi:type="string">
                                <![CDATA["The shipping address you have set on Amazon is not valid for the current store, please set another address","The billing address you have set on Amazon is not valid for the current store, please set another address.",Amazon pay not available,Amazon Pay]]>
                            </item>
                        </argument>
                    </arguments>
                </referenceBlock>
                ...
            </referenceContainer>
        </referenceContainer>
        ....
    </body>
</page>
```



## Documentation

- If you need information on the build process of the React Checkout, then you can **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/build/)**.
- If you want to know more about how Hyvä Checkout helps you to integrate any payment methods, then **[read more about it here](https://hyva-themes.github.io/magento2-react-checkout/payment-integration/)**.
- The official documentation of **[Hyvä React Checkout](https://hyva-themes.github.io/magento2-react-checkout)**
- The Magento module documentation of **[Amazon Pay](https://github.com/amzn/amazon-payments-magento-2-plugin)**

## Credits

Special thanks to Webvisum for building the initial release of this Amazon Pay integration for the Hyvä React Checkout!

# [![webvisum GmbH](https://webvisum.de/media/logo/websites/1/logo.png)](https://webvisum.de)

- [All Contributors][link-contributors]

## License

BSD 3-Clause License. Please see [License File](LICENSE.txt) for more information.

[link-contributors]: ../../contributors
