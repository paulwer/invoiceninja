/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { wait, instant } from '../wait';

class EwayRapid {
    constructor() {
        this.cardStyles =
            'padding: 2px; border: 1px solid #AAA; border-radius: 3px; height: 34px; width: 100%;';

        this.errorCodes = new Map();

        this.errorCodes.set('V6000', 'Validation error');
        this.errorCodes.set('V6001', 'Invalid CustomerIP');
        this.errorCodes.set('V6002', 'Invalid DeviceID');
        this.errorCodes.set('V6003', 'Invalid Request PartnerID');
        this.errorCodes.set('V6004', 'Invalid Request Method');
        this.errorCodes.set(
            'V6010',
            'Invalid TransactionType, account not certified for eCome only MOTO or Recurring available'
        );
        this.errorCodes.set('V6011', 'Invalid Payment TotalAmount');
        this.errorCodes.set('V6012', 'Invalid Payment InvoiceDescription');
        this.errorCodes.set('V6013', 'Invalid Payment InvoiceNumber');
        this.errorCodes.set('V6014', 'Invalid Payment InvoiceReference');
        this.errorCodes.set('V6015', 'Invalid Payment CurrencyCode');
        this.errorCodes.set('V6016', 'Payment Required');
        this.errorCodes.set('V6017', 'Payment CurrencyCode Required');
        this.errorCodes.set('V6018', 'Unknown Payment CurrencyCode');
        this.errorCodes.set(
            'V6019',
            'Cardholder identity authentication required'
        );
        this.errorCodes.set('V6020', 'Cardholder Input Required');
        this.errorCodes.set('V6021', 'EWAY_CARDHOLDERNAME Required');
        this.errorCodes.set('V6022', 'EWAY_CARDNUMBER Required');
        this.errorCodes.set('V6023', 'EWAY_CARDCVN Required');
        this.errorCodes.set(
            'V6024',
            'Cardholder Identity Authentication One Time Password Not Active Yet'
        );
        this.errorCodes.set('V6025', 'PIN Required');
        this.errorCodes.set('V6033', 'Invalid Expiry Date');
        this.errorCodes.set('V6034', 'Invalid Issue Number');
        this.errorCodes.set('V6035', 'Invalid Valid From Date');
        this.errorCodes.set('V6039', 'Invalid Network Token Status');
        this.errorCodes.set('V6040', 'Invalid TokenCustomerID');
        this.errorCodes.set('V6041', 'Customer Required');
        this.errorCodes.set('V6042', 'Customer FirstName Required');
        this.errorCodes.set('V6043', 'Customer LastName Required');
        this.errorCodes.set('V6044', 'Customer CountryCode Required');
        this.errorCodes.set('V6045', 'Customer Title Required');
        this.errorCodes.set('V6046', 'TokenCustomerID Required');
        this.errorCodes.set('V6047', 'RedirectURL Required');
        this.errorCodes.set(
            'V6048',
            'CheckoutURL Required when CheckoutPayment specified'
        );
        this.errorCodes.set('V6049', 'nvalid Checkout URL');
        this.errorCodes.set('V6051', 'Invalid Customer FirstName');
        this.errorCodes.set('V6052', 'Invalid Customer LastName');
        this.errorCodes.set('V6053', 'Invalid Customer CountryCode');
        this.errorCodes.set('V6058', 'Invalid Customer Title');
        this.errorCodes.set('V6059', 'Invalid RedirectURL');
        this.errorCodes.set('V6060', 'Invalid TokenCustomerID');
        this.errorCodes.set('V6061', 'Invalid Customer Reference');
        this.errorCodes.set('V6062', 'Invalid Customer CompanyName');
        this.errorCodes.set('V6063', 'Invalid Customer JobDescription');
        this.errorCodes.set('V6064', 'Invalid Customer Street1');
        this.errorCodes.set('V6065', 'Invalid Customer Street2');
        this.errorCodes.set('V6066', 'Invalid Customer City');
        this.errorCodes.set('V6067', 'Invalid Customer State');
        this.errorCodes.set('V6068', 'Invalid Customer PostalCode');
        this.errorCodes.set('V6069', 'Invalid Customer Email');
        this.errorCodes.set('V6070', 'Invalid Customer Phone');
        this.errorCodes.set('V6071', 'Invalid Customer Mobile');
        this.errorCodes.set('V6072', 'Invalid Customer Comments');
        this.errorCodes.set('V6073', 'Invalid Customer Fax');
        this.errorCodes.set('V6074', 'Invalid Customer URL');
        this.errorCodes.set('V6075', 'Invalid ShippingAddress FirstName');
        this.errorCodes.set('V6076', 'Invalid ShippingAddress LastName');
        this.errorCodes.set('V6077', 'Invalid ShippingAddress Street1');
        this.errorCodes.set('V6078', 'Invalid ShippingAddress Street2');
        this.errorCodes.set('V6079', 'Invalid ShippingAddress City');
        this.errorCodes.set('V6080', 'Invalid ShippingAddress State');
        this.errorCodes.set('V6081', 'Invalid ShippingAddress PostalCode');
        this.errorCodes.set('V6082', 'Invalid ShippingAddress Email');
        this.errorCodes.set('V6083', 'Invalid ShippingAddress Phone');
        this.errorCodes.set('V6084', 'Invalid ShippingAddress Country');
        this.errorCodes.set('V6085', 'Invalid ShippingAddress ShippingMethod');
        this.errorCodes.set('V6086', 'Invalid ShippingAddress Fax');
        this.errorCodes.set('V6091', 'Unknown Customer CountryCode');
        this.errorCodes.set('V6092', 'Unknown ShippingAddress CountryCode');
        this.errorCodes.set('V6093', 'Insufficient Address Information');
        this.errorCodes.set('V6100', 'Invalid EWAY_CARDNAME');
        this.errorCodes.set('V6101', 'Invalid EWAY_CARDEXPIRYMONTH');
        this.errorCodes.set('V6102', 'Invalid EWAY_CARDEXPIRYYEAR');
        this.errorCodes.set('V6103', 'Invalid EWAY_CARDSTARTMONTH');
        this.errorCodes.set('V6104', 'Invalid EWAY_CARDSTARTYEAR');
        this.errorCodes.set('V6105', 'Invalid EWAY_CARDISSUENUMBER');
        this.errorCodes.set('V6106', 'Invalid EWAY_CARDCVN');
        this.errorCodes.set('V6107', 'Invalid EWAY_ACCESSCODE');
        this.errorCodes.set('V6108', 'Invalid CustomerHostAddress');
        this.errorCodes.set('V6109', 'Invalid UserAgent');
        this.errorCodes.set('V6110', 'Invalid EWAY_CARDNUMBER');
        this.errorCodes.set(
            'V6111',
            'Unauthorised API Access, Account Not PCI Certified'
        );
        this.errorCodes.set(
            'V6112',
            'Redundant card details other than expiry year and month'
        );
        this.errorCodes.set('V6113', 'Invalid transaction for refund');
        this.errorCodes.set('V6114', 'Gateway validation error');
        this.errorCodes.set(
            'V6115',
            'Invalid DirectRefundRequest, Transaction ID'
        );
        this.errorCodes.set(
            'V6116',
            'Invalid card data on original TransactionID'
        );
        this.errorCodes.set(
            'V6117',
            'Invalid CreateAccessCodeSharedRequest, FooterText'
        );
        this.errorCodes.set(
            'V6118',
            'Invalid CreateAccessCodeSharedRequest, HeaderText'
        );
        this.errorCodes.set(
            'V6119',
            'Invalid CreateAccessCodeSharedRequest, Language'
        );
        this.errorCodes.set(
            'V6120',
            'Invalid CreateAccessCodeSharedRequest, LogoUrl'
        );
        this.errorCodes.set(
            'V6121',
            'Invalid TransactionSearch, Filter Match Type'
        );
        this.errorCodes.set(
            'V6122',
            'Invalid TransactionSearch, Non numeric Transaction ID'
        );
        this.errorCodes.set(
            'V6123',
            'Invalid TransactionSearch,no TransactionID or AccessCode specified'
        );
        this.errorCodes.set(
            'V6124',
            'Invalid Line Items. The line items have been provided however the totals do not match the TotalAmount field'
        );
        this.errorCodes.set('V6125', 'Selected Payment Type not enabled');
        this.errorCodes.set(
            'V6126',
            'Invalid encrypted card number, decryption failed'
        );
        this.errorCodes.set(
            'V6127',
            'Invalid encrypted cvn, decryption failed'
        );
        this.errorCodes.set('V6128', 'Invalid Method for Payment Type');
        this.errorCodes.set(
            'V6129',
            'Transaction has not been authorised for Capture/Cancellation'
        );
        this.errorCodes.set('V6130', 'Generic customer information error');
        this.errorCodes.set('V6131', 'Generic shipping information error');
        this.errorCodes.set(
            'V6132',
            'Transaction has already been completed or voided, operation not permitted'
        );
        this.errorCodes.set('V6133', 'Checkout not available for Payment Type');
        this.errorCodes.set(
            'V6134',
            'Invalid Auth Transaction ID for Capture/Void'
        );
        this.errorCodes.set('V6135', 'PayPal Error Processing Refund');
        this.errorCodes.set(
            'V6136',
            'Original transaction does not exist or state is incorrect'
        );
        this.errorCodes.set('V6140', 'Merchant account is suspended');
        this.errorCodes.set(
            'V6141',
            'Invalid PayPal account details or API signature'
        );
        this.errorCodes.set('V6142', 'Authorise not available for Bank/Branch');
        this.errorCodes.set('V6143', 'Invalid Public Key');
        this.errorCodes.set(
            'V6144',
            'Method not available with Public API Key Authentication'
        );
        this.errorCodes.set(
            'V6145',
            'Credit Card not allow if Token Customer ID is provided with Public API Key Authentication'
        );
        this.errorCodes.set(
            'V6146',
            'Client Side Encryption Key Missing or Invalid'
        );
        this.errorCodes.set(
            'V6147',
            'Unable to Create One Time Code for Secure Field'
        );
        this.errorCodes.set('V6148', 'Secure Field has Expired');
        this.errorCodes.set('V6149', 'Invalid Secure Field One Time Code');
        this.errorCodes.set('V6150', 'Invalid Refund Amount');
        this.errorCodes.set(
            'V6151',
            'Refund amount greater than original transaction'
        );
        this.errorCodes.set(
            'V6152',
            'Original transaction already refunded for total amount'
        );
        this.errorCodes.set('V6153', 'Card type not support by merchant');
        this.errorCodes.set('V6154', 'Insufficent Funds Available For Refund');
        this.errorCodes.set('V6155', 'Missing one or more fields in request');
        this.errorCodes.set('V6160', 'Encryption Method Not Supported');
        this.errorCodes.set(
            'V6161',
            'Encryption failed, missing or invalid key'
        );
        this.errorCodes.set(
            'V6165',
            'Invalid Click-to-Pay (Visa Checkout) data or decryption failed'
        );
        this.errorCodes.set(
            'V6170',
            'Invalid TransactionSearch, Invoice Number is not unique'
        );
        this.errorCodes.set(
            'V6171',
            'Invalid TransactionSearch, Invoice Number not found'
        );
        this.errorCodes.set('V6220', 'Three domain secure XID invalid');
        this.errorCodes.set('V6221', 'Three domain secure ECI invalid');
        this.errorCodes.set('V6222', 'Three domain secure AVV invalid');
        this.errorCodes.set('V6223', 'Three domain secure XID is required');
        this.errorCodes.set('V6224', 'Three Domain Secure ECI is required');
        this.errorCodes.set('V6225', 'Three Domain Secure AVV is required');
        this.errorCodes.set(
            'V6226',
            'Three Domain Secure AuthStatus is required'
        );
        this.errorCodes.set('V6227', 'Three Domain Secure AuthStatus invalid');
        this.errorCodes.set('V6228', 'Three domain secure Version is required');
        this.errorCodes.set(
            'V6230',
            'Three domain secure Directory Server Txn ID invalid'
        );
        this.errorCodes.set(
            'V6231',
            'Three domain secure Directory Server Txn ID is required'
        );
        this.errorCodes.set('V6232', 'Three domain secure Version is invalid');
        this.errorCodes.set('V6501', 'Invalid Amex InstallementPlan');
        this.errorCodes.set(
            'V6502',
            'Invalid Number Of Installements for Amex. Valid values are from 0 to 99 inclusive'
        );
        this.errorCodes.set('V6503', 'Merchant Amex ID required');
        this.errorCodes.set('V6504', 'Invalid Merchant Amex ID');
        this.errorCodes.set('V6505', 'Merchant Terminal ID required');
        this.errorCodes.set('V6506', 'Merchant category code required');
        this.errorCodes.set('V6507', 'Invalid merchant category code');
        this.errorCodes.set('V6508', 'Amex 3D ECI required');
        this.errorCodes.set('V6509', 'Invalid Amex 3D ECI');
        this.errorCodes.set('V6510', 'Invalid Amex 3D verification value');
        this.errorCodes.set('V6511', 'Invalid merchant location data');
        this.errorCodes.set('V6512', 'Invalid merchant street address');
        this.errorCodes.set('V6513', 'Invalid merchant city');
        this.errorCodes.set('V6514', 'Invalid merchant country');
        this.errorCodes.set('V6515', 'Invalid merchant phone');
        this.errorCodes.set('V6516', 'Invalid merchant postcode');
        this.errorCodes.set('V6517', 'Amex connection error');
        this.errorCodes.set(
            'V6518',
            'Amex EC Card Details API returned invalid data'
        );
        this.errorCodes.set(
            'V6520',
            'Invalid or missing Amex Point Of Sale Data'
        );
        this.errorCodes.set(
            'V6521',
            'Invalid or missing Amex transaction date time'
        );
        this.errorCodes.set(
            'V6522',
            'Invalid or missing Amex Original transaction date time'
        );
        this.errorCodes.set(
            'V6530',
            'Credit Card Number in non Credit Card Field'
        );
    }

    get groupFieldConfig() {
        return {
            publicApiKey: document.querySelector('meta[name=public-api-key]')
                ?.content,
            fieldDivId: 'eway-secure-panel',
            fieldType: 'group',
            styles: '',
            layout: {
                fonts: ['Lobster'],
                rows: [
                    {
                        styles: '',
                        cells: [
                            {
                                colSpan: 12,
                                styles: 'margin-top: 15px;',
                                label: {
                                    fieldColSpan: 4,
                                    text: document.querySelector(
                                        'meta[name=translation-card-name]'
                                    )?.content,
                                    styles: '',
                                },
                                field: {
                                    fieldColSpan: 8,
                                    fieldType: 'name',
                                    styles: this.cardStyles,
                                    divStyles: 'padding-left: 10px;',
                                },
                            },
                            {
                                colSpan: 12,
                                styles: 'margin-top: 15px;',
                                label: {
                                    fieldColSpan: 4,
                                    text: document.querySelector(
                                        'meta[name=translation-expiry_date]'
                                    )?.content,
                                    styles: '',
                                },
                                field: {
                                    fieldColSpan: 8,
                                    fieldType: 'expirytext',
                                    styles: this.cardStyles,
                                    divStyles: 'padding-left: 10px;',
                                },
                            },
                        ],
                    },
                    {
                        styles: '',
                        cells: [
                            {
                                colSpan: 12,
                                styles: 'margin-top: 15px;',
                                label: {
                                    fieldColSpan: 4,
                                    text: document.querySelector(
                                        'meta[name=translation-card_number]'
                                    )?.content,
                                    styles: '',
                                },
                                field: {
                                    fieldColSpan: 8,
                                    fieldType: 'card',
                                    styles: this.cardStyles,
                                },
                            },
                            {
                                colSpan: 12,
                                styles: 'margin-top: 15px;',
                                label: {
                                    fieldColSpan: 4,
                                    text: document.querySelector(
                                        'meta[name=translation-cvv]'
                                    )?.content,
                                    styles: '',
                                },
                                field: {
                                    fieldColSpan: 8,
                                    fieldType: 'cvn',
                                    styles: this.cardStyles,
                                },
                            },
                        ],
                    },
                ],
            },
        };
    }

    securePanelCallback(event) {
        document.getElementById('errors').hidden = true;

        if (event.errors) {
            return this.handleErrors(event.errors);
        }

        if (document.getElementById('authorize-card')) {
            document.getElementById('authorize-card').disabled = false;
        }

        if (document.getElementById('pay-now')) {
            document.getElementById('pay-now').disabled = false;
        }

        document.querySelector('input[name=securefieldcode]').value =
            event.secureFieldCode;
    }

    handleErrors(errors) {
        let _errors = errors.split(' ');
        let shouldShowGenericError = false;
        let message = '';

        _errors.forEach((error) => {
            message = message.concat(this.errorCodes.get(error) + '<br>');
        });

        document.getElementById('errors').innerHTML = message;
        document.getElementById('errors').hidden = false;
    }

    completeAuthorization(event) {
        event.target.parentElement.disabled = true;

        const button = document.getElementById('authorize-card');

        button.querySelector('svg').classList.remove('hidden');
        button.querySelector('span').classList.add('hidden');

        document.getElementById('server-response').submit();
    }

    completePaymentUsingToken(event) {
        event.target.parentElement.disabled = true;

        document.getElementById('server-response').submit();
    }

    completePaymentWithoutToken(event) {
        event.target.parentElement.disabled = true;

        let tokenBillingCheckbox = document.querySelector(
            'input[name="token-billing-checkbox"]:checked'
        );

        if (tokenBillingCheckbox) {
            document.querySelector('input[name="store_card"]').value =
                tokenBillingCheckbox.value;
        }

        document.getElementById('server-response').submit();
    }

    initialize() {
        this.eWAY = eWAY.setupSecureField(this.groupFieldConfig, (event) =>
            this.securePanelCallback(event)
        );
    }

    handle() {
        this.initialize();

        document
            .getElementById('authorize-card')
            ?.addEventListener('click', (e) => this.completeAuthorization(e));

        Array.from(
            document.getElementsByClassName('toggle-payment-with-token') ?? []
        ).forEach((element) =>
            element.addEventListener('click', (element) => {
                document
                    .getElementById('eway-secure-panel')
                    .classList.add('hidden');
                document.getElementById('save-card--container').style.display =
                    'none';
                document.querySelector('input[name=token]').value =
                    element.target.dataset.token;
                document.getElementById('pay-now').disabled = false;
            })
        );

        if (document.getElementById('toggle-payment-with-credit-card')) {
            document
                .getElementById('toggle-payment-with-credit-card')
                .addEventListener('click', (element) => {
                    document
                        .getElementById('eway-secure-panel')
                        .classList.remove('hidden');
                    document.getElementById(
                        'save-card--container'
                    ).style.display = 'grid';
                    document.querySelector('input[name=token]').value = '';
                    document.getElementById('pay-now').disabled = true;
                });
        }

        const payNowButton = document.getElementById('pay-now');

        document.getElementById('pay-now')?.addEventListener('click', (e) => {
            let tokenInput = document.querySelector('input[name=token]');

            payNowButton.querySelector('svg').classList.remove('hidden');
            payNowButton.querySelector('span').classList.add('hidden');

            if (tokenInput.value) {
                return this.completePaymentUsingToken(e);
            }

            return this.completePaymentWithoutToken(e);
        });
    }
}

function boot() {
    new EwayRapid().handle();

    /** @type {NodeListOf<HTMLInputElement>} */
    const tokens = document.querySelectorAll('input.toggle-payment-with-token');

    if (tokens.length > 0) {
        tokens[0].click();
    }
}

instant() ? boot() : wait('#eway-credit-card-payment').then(() => boot());
