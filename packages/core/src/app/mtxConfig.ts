export const mtxConfig = {
    shippingMethods: {
        corriereStandard: 'Corriere Espresso',
        corriereContrassegno: 'Corriere Contrassegno',
        corriereConsegnaInNegozio: 'Consegna in negozio',
    },
    OrderConfirmation: {
        textCod: "Abbiamo ricevuto il tuo ordine. L'ordine è in fase di elaborazione nel nostro sistema. L'elaborazione potrebbe richiedere alcuni minuti.",
    },
    AddressCustomFields: {
        pIvaID: "30", // Partiva IVA / Codice fiscale   TEST: 29 - PROD: 30
        fattID: "32", // Fatt   TEST: 33 - PROD: 32
    }
}