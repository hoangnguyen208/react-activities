import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLInputElement>, FormFieldProps {}

const TextInput: React.FC<IProps> = ({input, width, type, placeholder, disabled, meta: {touched, error}}) => {
    return (
        // !! operator below means 'error !== null ? true : false' 
        <Form.Field error={touched && !!error} type={type} width={width}>
            <input {...input} placeholder={placeholder} disabled={disabled} />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}

export default TextInput
