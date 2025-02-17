import React, { useState } from 'react';
import { CheckoutService } from '@bigcommerce/checkout-sdk';

export default function ReceiveInvoice({
    isInvoiceValidated, setIsInvoiceValidated, isInvoiceChecked, setIsInvoiceChecked,
    checkoutService
}:
    {
        isInvoiceValidated: boolean, setIsInvoiceValidated: (checked: boolean) => void,
        isInvoiceChecked: boolean, setIsInvoiceChecked: (checked: boolean) => void,
        checkoutService: CheckoutService
    }) {

    const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento


    const [formData, setFormData] = useState({
        company: '',
        vat: ''
    });

    const [errors, setErrors] = useState({
        company: '',
        vat: ''
    });

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.checked) {
            // Svuota i campi se la checkbox viene deselezionata
            setFormData({
                company: '',
                vat: ''
            });

            await clearBillingAddressFields();
        }
        setIsInvoiceChecked(event.target.checked);
        setIsInvoiceValidated(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: { company: string; vat: string } = { company: '', vat: '' };

        // Validazione per Nome dell'azienda
        if (!formData.company.trim()) {
            newErrors.company = 'Il nome dell\'azienda è obbligatorio';
            valid = false;
        } else if (formData.company.length < 3) {
            newErrors.company = 'Il nome dell\'azienda deve contenere almeno 3 caratteri';
            valid = false;
        }

        // Validazione per Partita IVA
        if (!formData.vat.trim()) {
            newErrors.vat = 'La partita IVA è obbligatoria';
            valid = false;
        } else if (formData.vat.length < 11) {
            newErrors.vat = 'La partita IVA deve contenere almeno 11 caratteri';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Funzione per ottenere l'ID di un custom field in base alla label
    const getCustomFieldIdByLabel = (fields: any[], label: string) => {
        const field = fields.find(f => f.label.toLowerCase() === label.toLowerCase() && f.custom);
        return field ? field.id : null;
    };

    const clearBillingAddressFields = async () => {

        const currentBillingAddress = await checkoutService.getState().data.getBillingAddress();
        const fields = await checkoutService.getState().data.getBillingAddressFields('IT');

        if (currentBillingAddress) {
            // Imposta 'company' a una stringa vuota
            currentBillingAddress.company = '';

            // Ottieni gli ID dei custom field in base alla label
            const pivaFieldId = getCustomFieldIdByLabel(fields, "piva");
            const fattFieldId = getCustomFieldIdByLabel(fields, "fatt");

            // Aggiorna i campi custom per "piva" e "fatt" a valori vuoti
            const updatedCustomFields = currentBillingAddress.customFields.map(field => {
                if (field.fieldId === pivaFieldId) {
                    return { ...field, fieldValue: '' }; // Resetta il valore di piva
                }
                if (field.fieldId === fattFieldId) {
                    return { ...field, fieldValue: '' }; // Resetta il valore di fatt
                }
                return field;
            });

            // Esegui l'aggiornamento dell'indirizzo di fatturazione
            await checkoutService.updateBillingAddress({
                ...currentBillingAddress,  // Mantieni i dati esistenti
                customFields: updatedCustomFields // Resetta i custom fields
            });

        }
    };


    // Funzione separata per aggiornare l'indirizzo di fatturazione
    const updateBillingAddress = async () => {
        const currentBillingAddress = await checkoutService.getState().data.getBillingAddress();
        const fields = await checkoutService.getState().data.getBillingAddressFields('IT');

        if (currentBillingAddress) {
            // Ottieni gli ID dei custom field in base alla label
            const pivaFieldId = getCustomFieldIdByLabel(fields, "piva");
            const fattFieldId = getCustomFieldIdByLabel(fields, "fatt");

            currentBillingAddress.company = formData.company;

            // Aggiorna il campo customFields con i nuovi valori
            const updatedCustomFields = currentBillingAddress.customFields.map(field => {
                if (field.fieldId === pivaFieldId) {
                    return { ...field, fieldValue: formData.vat }; // Modifica il valore del campo "piva"
                }
                if (field.fieldId === fattFieldId) {
                    return { ...field, fieldValue: 'Y' }; // Modifica il valore del campo "fatt"
                }
                return field;
            });

            // Esegui l'aggiornamento dell'indirizzo di fatturazione
            await checkoutService.updateBillingAddress({
                ...currentBillingAddress,  // Mantieni i dati esistenti
                customFields: updatedCustomFields // Aggiorna i custom fields
            });
        }
    };

    const handleButtonClick = async () => {
        if (validateForm()) {
            // Avvia l'animazione di caricamento
            setIsLoading(true);

            // Simula il salvataggio dei dati (puoi mettere il tuo codice qui)

            // Setto i campi su fattura : TODOS
            setIsInvoiceValidated(true);

            // Chiamata alla funzione per aggiornare l'indirizzo di fatturazione
            await updateBillingAddress();

            // Termina l'animazione di caricamento dopo 5 secondi
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } else {
            await clearBillingAddressFields();
        }
    };

    return (
        <>
            <form>
                <fieldset className="form-fieldset" >
                    <fieldset className="form-fieldset">
                        <div className="form-body">
                            <div className="dynamic-form-field">
                                <div className="form-field">
                                    <input
                                        id="receiveInvoiceCheckbox"
                                        type="checkbox"
                                        className="form-checkbox optimizedCheckout-form-checkbox"
                                        name="receiveInvoice"
                                        data-test="receiveInvoice-checkbox"
                                        checked={isInvoiceChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label
                                        htmlFor="receiveInvoiceCheckbox"
                                        className="form-label optimizedCheckout-form-label"
                                    >
                                        Hai bisogno della fattura?
                                    </label>
                                </div>
                            </div>

                            {isInvoiceChecked && (
                                <>
                                    <p className="optimizedCheckout-contentSecondary">
                                        Se hai bisogno di un indirizzo di fatturazione diverso da quello di spedizione, compila l'indirizzo di fatturazione nella sezione di pagamento.
                                    </p>

                                    {/* Campo Nome Azienda */}
                                    <div className={`dynamic-form-field floating-form-field ${errors.company ? 'form-field--error' : ''}`}>
                                        <div className="form-field" style={{ marginBottom: '15px' }}>
                                            <input
                                                id="companyInput"
                                                type="text"
                                                className="form-input optimizedCheckout-form-input floating-input"
                                                name="company"
                                                placeholder=" "
                                                value={formData.company}
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                htmlFor="companyInput"
                                                className="floating-label form-label optimizedCheckout-form-label"
                                            >
                                                Nome dell'azienda
                                            </label>
                                            {errors.company && (
                                                <ul className="form-field-errors" data-test="company-error-message">
                                                    <li className="form-field-error">
                                                        <label aria-live="polite" className="form-inlineMessage" role="alert">
                                                            {errors.company}
                                                        </label>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Campo Partita IVA */}
                                    <div className={`dynamic-form-field floating-form-field ${errors.vat ? 'form-field--error' : ''}`}>
                                        <div className="form-field">
                                            <input
                                                id="vatInput"
                                                type="text"
                                                className="form-input optimizedCheckout-form-input floating-input"
                                                name="vat"
                                                placeholder=" "
                                                value={formData.vat}
                                                onChange={handleInputChange}
                                            />
                                            <label
                                                htmlFor="vatInput"
                                                className="floating-label form-label optimizedCheckout-form-label"
                                            >
                                                Partita IVA
                                            </label>
                                            {errors.vat && (
                                                <ul className="form-field-errors" data-test="vat-error-message">
                                                    <li className="form-field-error">
                                                        <label aria-live="polite" className="form-inlineMessage" role="alert">
                                                            {errors.vat}
                                                        </label>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-actions" style={{ marginBottom: '15px' }}>
                                        <button
                                            id="checkout-payment-continue"
                                            className="button button--large button--slab optimizedCheckout-buttonPrimary"
                                            type="button"
                                            onClick={handleButtonClick}
                                        >
                                            {isLoading ? (
                                                <div className="loading-overlay" style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>  {/* Usa le classi esistenti per il mascherino */}
                                                    <div className="spinner"></div> {/* Usa la classe per lo spinner */}
                                                    <div className="loading-text">SALVANDO ...</div> {/* Testo opzionale */}
                                                </div>
                                            ) : <>SALVA FATTURA</>}
                                        </button>
                                    </div>
                                    {!isInvoiceValidated && (
                                        <div className="form-actions">
                                            <button
                                                disabled
                                                id="checkout-payment-continue-sample-button"
                                                className="button button--action button--large button--slab optimizedCheckout-buttonPrimary"
                                                type="button"
                                            >
                                                EFFETTUA ORDINE
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </fieldset>
            </form>
        </>
    );
}
