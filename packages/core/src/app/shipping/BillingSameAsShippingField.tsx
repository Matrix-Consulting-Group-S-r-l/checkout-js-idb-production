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

    // Recupero del contesto di checkout e del servizio associato
    const context = useContext(CheckoutContext);
    const checkoutService = context?.checkoutService;

    // Recupero del corriere attualmente selezionato
    const currentCarrier = checkoutService?.getState().data.getSelectedShippingOption(); // corriere selezionato


    // Al caricamento del componente, sincronizza lo stato della checkbox "Hai bisogno della fattura?"
    useEffect(() => {

        const currentBillingAddress = checkoutService?.getState().data.getBillingAddress();
        const currentBillingAddressCustomFields = currentBillingAddress?.customFields || [];

        // Recupero il valore del campo custom 'fatt' dalla configurazione
        const fattFieldId = "field_" + mtxConfig.AddressCustomFields.fattID;
        const fieldValue = currentBillingAddressCustomFields.find(field => field.fieldId === fattFieldId)?.fieldValue || '';

        // Setta lo stato del checkbox "Hai bisogno della fattura?" in base ai dati recuperati
        const checkboxInvoce = document.getElementById("setInvoice") as HTMLInputElement | null;
        if (checkboxInvoce) {
            checkboxInvoce.checked = fieldValue === 'Y';
            const checkboxSameAsBilling = document.getElementById("sameAsBilling") as HTMLInputElement | null;
            if (fieldValue === 'Y' && checkboxSameAsBilling?.checked) {
                setTimeout(() => {
                    enableSameAsBilling(false, checkboxSameAsBilling);
                }, 1200);
            }
        }
    }, []);

    // Gestisce il cambio del checkbox "Hai bisogno della fattura?"
    const onChangeSetInvoice = (event: React.ChangeEvent<HTMLInputElement>) => {

        const checkboxInvoce = event.target;
        const checkboxInvoceState = checkboxInvoce.checked;

        // Recupero il checkbox "Same as Billing"
        const checkboxSameAsBilling = document.getElementById("sameAsBilling") as HTMLInputElement | null;
        if (currentCarrier) {
            if (currentCarrier.description === mtxConfig.shippingMethods.corriereStandard) {
                // Se è Corriere Standard, abilito/disabilito "Same as Billing" e fattura in base allo stato attuale
                enableSameAsBilling(!checkboxInvoceState, checkboxSameAsBilling);
                enableInvoice(checkboxInvoceState, event.target);

            } else if (currentCarrier.description === mtxConfig.shippingMethods.corriereConsegnaInNegozio) {
                // Se è Consegna in Negozio, forzo "Same as Billing" disabilitato e aggiorno fattura
                enableSameAsBilling(false, checkboxSameAsBilling);
                enableInvoice(checkboxInvoceState, event.target);
            }
        } else {
            // TODOS: Da gestire se nessun corriere è stato selezionato
        }
    };

    // Abilita o disabilita la checkbox "Same as Billing" cliccando solo se necessario
    const enableSameAsBilling = (enable: boolean, checkboxSameAsBilling: HTMLInputElement | null) => {
        if (checkboxSameAsBilling && checkboxSameAsBilling.checked !== enable) {
            checkboxSameAsBilling.click();
        }
    };

    // Abilita/disabilita la fattura e aggiorna il backend
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

    // Aggiorna il custom field 'fatt' per l'indirizzo di fatturazione nel backend
    const updateCustomFieldInvoice = async (isChecked: boolean) => {
        const currentBillingAddress = checkoutService?.getState().data.getBillingAddress();
        const currentBillingAddressCustomFields = currentBillingAddress?.customFields || [];

        const fattFieldId = "field_" + mtxConfig.AddressCustomFields.fattID;
        const fieldValue = isChecked ? 'Y' : '';

        // Controlla se esiste già il campo 'fatt'
        const hasFattField = currentBillingAddressCustomFields.some(field => field.fieldId === fattFieldId);

        let updatedCustomFields;

        if (hasFattField) {
            // Aggiorna il campo esistente
            updatedCustomFields = currentBillingAddressCustomFields.map(field =>
                field.fieldId === fattFieldId
                    ? { ...field, fieldValue }
                    : field
            );
        } else {
            // Aggiunge il campo se non esiste
            updatedCustomFields = [
                ...currentBillingAddressCustomFields,
                { fieldId: fattFieldId, fieldValue },
            ];
        }

        // Salva l'indirizzo aggiornato con i nuovi custom fields
        if (currentBillingAddress) {
            await checkoutService?.updateBillingAddress({
                ...currentBillingAddress,
                customFields: updatedCustomFields,
            });
        }
    };

    // Renderizza il componente con due checkbox: "Same as Billing" e "Hai bisogno della fattura?"
    return (
        <>
            <div style={{ display: "none" }}>
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
