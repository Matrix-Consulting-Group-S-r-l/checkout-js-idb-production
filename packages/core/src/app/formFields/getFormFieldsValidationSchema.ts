import { memoize } from '@bigcommerce/memoize';
import { object, ObjectSchema, string, StringSchema } from 'yup';

import getCustomFormFieldsValidationSchema, {
    FormFieldsValidationSchemaOptions,
} from './getCustomFormFieldsValidationSchema';

export const WHITELIST_REGEXP = /^[^<>]*$/;

export const PHONE_REGEXP = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/; // ---------------MTX [Single Line]--------------

export interface FormFieldValues {
    [key: string]: string | { [id: string]: any };
}

export default memoize(function getFormFieldsValidationSchema({
    formFields,
    translate = () => undefined,
    validateGoogleMapAutoCompleteMaxLength = false,
    validateAddressFields = false,
}: FormFieldsValidationSchemaOptions): ObjectSchema<FormFieldValues> {
    return object({
        ...formFields
            .filter(({ custom }) => !custom)
            .reduce((schema, { name, required, label, maxLength }) => {
                schema[name] = string();

                if (required) {
                    schema[name] = schema[name]
                        .trim()
                        .required(translate('required', { label, name }));
                }

                // ---------------MTX [Multiple Line - INIT]--------------
                if (required && name === 'phone') {
                    schema[name] = schema[name].matches(
                        PHONE_REGEXP,
                        translate('invalid', { name, label }),
                    );
                }
                // ---------------MTX [Multiple Line - END]--------------

                if (name === 'address1' && maxLength && validateGoogleMapAutoCompleteMaxLength) {
                    schema[name] = schema[name]
                        .max(maxLength, translate('max', { label, name, max: maxLength }));
                }

                if ((name === 'address1' || name === 'address2') && maxLength && validateAddressFields) {
                    schema[name] = schema[name]
                        .max(maxLength, translate('max', { label, name, max: maxLength }));
                }

                schema[name] = schema[name].matches(
                    WHITELIST_REGEXP,
                    translate('invalid', { name, label }),
                );

                return schema;
            }, {} as { [key: string]: StringSchema }),
    }).concat(
        getCustomFormFieldsValidationSchema({ formFields, translate }),
    ) as ObjectSchema<FormFieldValues>;
});
