import React, { useState } from 'react';

export default function ReceiveInvoice({ isInvoiceValidated, setIsInvoiceValidated, isInvoiceChecked, setIsInvoiceChecked }:
    {
        isInvoiceValidated: boolean, setIsInvoiceValidated: (checked: boolean) => void,
        isInvoiceChecked: boolean, setIsInvoiceChecked: (checked: boolean) => void
    }) {

    const [formData, setFormData] = useState({
        company: '',
        vat: ''
    });

    const [errors, setErrors] = useState({
        company: '',
        vat: ''
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.checked) {
            // Svuota i campi se la checkbox viene deselezionata
            setFormData({
                company: '',
                vat: ''
            });
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

    const handleButtonClick = () => {
        if (validateForm()) {
            // Simula il salvataggio dei dati (puoi mettere il tuo codice qui)
            console.log('.. Fattura simulata e salvata: ... ', formData, "isInvoiceValidated", isInvoiceValidated);
            // Setto i campi su fattura : TODOS
            setIsInvoiceValidated(true);
        }
    };

    return (
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
                                    <div className="form-field">
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

                                <div className="form-actions">
                                    <button
                                        id="checkout-payment-continue"
                                        className="button button--large button--slab optimizedCheckout-buttonPrimary"
                                        type="button"
                                        onClick={handleButtonClick}
                                    >
                                        SALVA FATTURA
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
    );
}
