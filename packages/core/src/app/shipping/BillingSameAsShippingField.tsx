import React, { FunctionComponent, memo, useMemo, useContext, useEffect } from 'react';

import { TranslatedString } from '@bigcommerce/checkout/locale';
import { CheckboxFormField } from '../ui/form';
import { CheckoutContext } from '@bigcommerce/checkout/payment-integration-api';
import { mtxConfig } from '../mtxConfig';

export interface BillingSameAsShippingFieldProps {
    onChange?(isChecked: boolean): void;
}

const BillingSameAsShippingField: FunctionComponent<BillingSameAsShippingFieldProps> = ({
    onChange,
}) => {

    const labelContent = useMemo(
        () => <TranslatedString id="billing.use_shipping_address_label" />,
        [],
    );

    const context = useContext(CheckoutContext);
    const checkoutService = context?.checkoutService;
    const currentCarrier = checkoutService?.getState().data.getSelectedShippingOption(); // corriere selezionato

    useEffect(() => {

        const currentBillingAddress = checkoutService?.getState().data.getBillingAddress();
        const currentBillingAddressCustomFields = currentBillingAddress?.customFields || [];

        console.log("run currentBillingAddress ...", currentBillingAddress)

        const fattFieldId = "field_" + mtxConfig.AddressCustomFields.fattID;
        const fieldValue = currentBillingAddressCustomFields.find(field => field.fieldId === fattFieldId)?.fieldValue || '';

        const checkboxInvoce = document.getElementById("setInvoice") as HTMLInputElement | null;
        if (checkboxInvoce) {
            checkboxInvoce.checked = fieldValue === 'Y';
        }


    }, []);


    const onChangeSetInvoice = (event: React.ChangeEvent<HTMLInputElement>) => {

        const checkboxInvoce = event.target;
        const checkboxInvoceState = checkboxInvoce.checked;
        const checkboxSameAsBilling = document.getElementById("sameAsBilling") as HTMLInputElement | null;
        if (currentCarrier) {
            if (currentCarrier.description === mtxConfig.shippingMethods.corriereStandard) {
                enableSameAsBilling(!checkboxInvoceState, checkboxSameAsBilling);
                enableInvoice(checkboxInvoceState, event.target);

            } else if (currentCarrier.description === mtxConfig.shippingMethods.corriereConsegnaInNegozio) {
                enableSameAsBilling(false, checkboxSameAsBilling);
                enableInvoice(checkboxInvoceState, event.target);
            }
        } else {
            // Gestire caso senza corriere
        }
    };

    const enableSameAsBilling = (enable: boolean, checkboxSameAsBilling: HTMLInputElement | null) => {
        if (checkboxSameAsBilling && checkboxSameAsBilling.checked !== enable) {
            checkboxSameAsBilling.click();
        }
    };

    const enableInvoice = async (enable: boolean, checkboxInvoce: HTMLInputElement | null) => {
        if (checkboxInvoce) {
            if (enable) {
                checkboxInvoce.checked = true; // inviare fattura
                updateCustomFieldInvoice(true);
            } else {
                checkboxInvoce.checked = false; // non inviare fattura
                updateCustomFieldInvoice(false);
            }
        }
    };

    const updateCustomFieldInvoice = async (isChecked: boolean) => {
        const currentBillingAddress = checkoutService?.getState().data.getBillingAddress();
        const currentBillingAddressCustomFields = currentBillingAddress?.customFields || [];

        const fattFieldId = "field_" + mtxConfig.AddressCustomFields.fattID;
        const fieldValue = isChecked ? 'Y' : '';

        const hasFattField = currentBillingAddressCustomFields.some(field => field.fieldId === fattFieldId);

        let updatedCustomFields;

        if (hasFattField) {
            updatedCustomFields = currentBillingAddressCustomFields.map(field =>
                field.fieldId === fattFieldId
                    ? { ...field, fieldValue }
                    : field
            );
        } else {
            updatedCustomFields = [
                ...currentBillingAddressCustomFields,
                { fieldId: fattFieldId, fieldValue },
            ];
        }

        if (currentBillingAddress) {
            await checkoutService?.updateBillingAddress({
                ...currentBillingAddress,
                customFields: updatedCustomFields,
            });
        }
    };

    return (
        <>
            <div style={{ display: "block" }}>
                <CheckboxFormField
                    id="sameAsBilling"
                    labelContent={labelContent}
                    name="billingSameAsShipping"
                    onChange={onChange}
                    testId="billingSameAsShipping"
                />
            </div>
            <div className="form-field">
                <input
                    id="setInvoice"
                    type="checkbox"
                    className="form-checkbox optimizedCheckout-form-checkbox"
                    data-test="billingSameAsShipping"
                    value="y"
                    onChange={onChangeSetInvoice}
                />
                <label
                    htmlFor="setInvoice"
                    className="form-label optimizedCheckout-form-label"
                    style={{ fontWeight: "700", marginTop: "10px", fontSize: "1.2rem" }}
                >
                    Hai bisogno della fattura?
                </label>
            </div>
        </>
    );
};

export default memo(BillingSameAsShippingField);
