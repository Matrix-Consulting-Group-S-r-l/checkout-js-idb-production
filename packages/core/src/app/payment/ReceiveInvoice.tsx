import React, { useState } from 'react';

const ReceiveInvoice: React.FC = () => {
    const [isInvoiceChecked, setIsInvoiceChecked] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        vat: '',
        pec: '',
        sdi: ''
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.checked) {
            // Svuota i campi se la checkbox viene deselezionata
            setFormData({
                company: '',
                vat: '',
                pec: '',
                sdi: ''
            });
        }
        setIsInvoiceChecked(event.target.checked);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    console.log("form data")

    return (
        <fieldset className="form-fieldset" style={{ marginBottom: '20px' }}>
            <div className="form-body">
                <div className="dynamic-form-field" style={{ marginBottom: '15px' }}>
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
                        <p className="optimizedCheckout-contentSecondary" style={{ marginBottom: '15px' }}>
                            Se hai bisogno di un indirizzo di fatturazione diverso da quello di spedizione, compila l'indirizzo di fatturazione nella sezione di pagamento.
                        </p>

                        <div className="dynamic-form-field floating-form-field" style={{ marginBottom: '15px' }}>
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
                            </div>
                        </div>

                        <div className="dynamic-form-field floating-form-field" style={{ marginBottom: '15px' }}>
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
                            </div>
                        </div>

                        <div className="dynamic-form-field floating-form-field" style={{ marginBottom: '15px' }}>
                            <div className="form-field">
                                <input
                                    id="pecInput"
                                    type="email"
                                    className="form-input optimizedCheckout-form-input floating-input"
                                    name="pec"
                                    placeholder=" "
                                    value={formData.pec}
                                    onChange={handleInputChange}
                                />
                                <label
                                    htmlFor="pecInput"
                                    className="floating-label form-label optimizedCheckout-form-label"
                                >
                                    PEC
                                </label>
                            </div>
                        </div>

                        <div className="dynamic-form-field floating-form-field" style={{ marginBottom: '15px' }}>
                            <div className="form-field">
                                <input
                                    id="sdiInput"
                                    type="text"
                                    className="form-input optimizedCheckout-form-input floating-input"
                                    name="sdi"
                                    placeholder=" "
                                    value={formData.sdi}
                                    onChange={handleInputChange}
                                />
                                <label
                                    htmlFor="sdiInput"
                                    className="floating-label form-label optimizedCheckout-form-label"
                                >
                                    Codice SDI
                                </label>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </fieldset>
    );
};

export default ReceiveInvoice;
