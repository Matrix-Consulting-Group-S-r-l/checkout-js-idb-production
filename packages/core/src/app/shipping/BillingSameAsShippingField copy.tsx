import React, { FunctionComponent, memo, useContext, useEffect, useMemo } from 'react';

import { TranslatedString } from '@bigcommerce/checkout/locale';

import { CheckboxFormField } from '../ui/form';
import { CheckoutContext } from '@bigcommerce/checkout/payment-integration-api';

export interface BillingSameAsShippingFieldProps {
    onChange?(isChecked: boolean): void;
}

const BillingSameAsShippingField: FunctionComponent<BillingSameAsShippingFieldProps> = ({
    onChange,
}) => {

    const context = useContext(CheckoutContext);

    const labelContent = useMemo(
        () => <TranslatedString id="billing.use_shipping_address_label" />,
        [],
    );

    async function onChangeSetInvoice(event: React.ChangeEvent<HTMLInputElement>) {
        const billingSameAsShipping = document.getElementById("sameAsBilling") as HTMLInputElement | null;
        if (billingSameAsShipping && billingSameAsShipping.checked == event.target.checked) {
            billingSameAsShipping.click();
        }

        if (event.target.checked) {
            await updateBillingAddress(event.target.checked);
        }
    }

    useEffect(() => {
        const billingSameAsShipping = document.getElementById("sameAsBilling") as HTMLInputElement | null;
        if (billingSameAsShipping && !billingSameAsShipping.checked) {
            const setInvoice = document.getElementById("setInvoice") as HTMLInputElement | null;
            if (setInvoice) {
                setInvoice.checked = true;
            }
        }
    }, []);

    // Funzione per ottenere l'ID di un custom field in base alla label
    const getCustomFieldIdByLabel = (fields: any[], label: string) => {
        const field = fields.find((f) => f.label.toLowerCase() === label.toLowerCase() && f.custom);
        return field ? field.id : null;
    };

    // Funzione separata per aggiornare l'indirizzo di fatturazione
    const updateBillingAddress = async (isChecked: boolean) => {
        const checkoutService = context?.checkoutService;

        if (checkoutService) {
            try {
                // Ottieni lo stato attuale dell'indirizzo di fatturazione
                const currentBillingAddress = await checkoutService.getState().data.getBillingAddress();
                const fields = await checkoutService.getState().data.getBillingAddressFields('IT');

                if (currentBillingAddress) {
                    // Trova l'ID del campo personalizzato "fatt"
                    const fattFieldId = getCustomFieldIdByLabel(fields, 'fatt');

                    if (!fattFieldId) {
                        console.error("Il campo 'fatt' non esiste tra i campi disponibili.");
                        return;
                    }

                    // Determina il nuovo valore del campo in base a isChecked
                    const newFieldValue = isChecked ? 'Y' : '';

                    // Verifica se il campo "fatt" è già presente nei customFields
                    const existingField = currentBillingAddress.customFields?.find(field => field.fieldId === fattFieldId);

                    let updatedCustomFields;

                    if (existingField) {
                        // Se il campo esiste, aggiorniamo il valore
                        updatedCustomFields = currentBillingAddress.customFields.map(field =>
                            field.fieldId === fattFieldId ? { ...field, fieldValue: newFieldValue } : field
                        );
                    } else {
                        // Se il campo non esiste, lo aggiungiamo
                        updatedCustomFields = [
                            ...(currentBillingAddress.customFields || []), // Mantieni i campi esistenti
                            { fieldId: fattFieldId, fieldValue: newFieldValue } // Aggiungi il nuovo campo
                        ];
                    }

                    // Aggiorna l'indirizzo di fatturazione con il nuovo valore
                    await checkoutService.updateBillingAddress({
                        ...currentBillingAddress, // Mantieni i dati esistenti
                        customFields: updatedCustomFields, // Aggiorna o aggiungi i custom fields
                    });

                }
            } catch (error) {
                console.error("Errore nell'aggiornamento dell'indirizzo di fatturazione:", error);
            }
        }
    };


    console.log("done");

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
                <input id="setInvoice" type="checkbox" className="form-checkbox optimizedCheckout-form-checkbox" name="" data-test="billingSameAsShipping" value="y" onChange={onChangeSetInvoice} />
                <label htmlFor="setInvoice" className="form-label optimizedCheckout-form-label" style={{ fontWeight: "700", marginTop: "10px", fontSize: "1.2rem" }}>Hai bisogno della fattura?</label>
            </div>
        </>
    );
};

export default memo(BillingSameAsShippingField);
