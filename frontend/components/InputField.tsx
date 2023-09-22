import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { Field, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    type?: "email" | "password";
    placeholder?: string,
    textarea?: boolean,
};

export const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            {props.textarea && props.textarea == true ? (
                <FormControl isInvalid={!!error}>
                    <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
                    <Field
                        as={Textarea}
                        id={field.name}
                        name={field.name}
                        placeholder={props.placeholder}
                    />
                    {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
                </FormControl>

            ) : (
                <FormControl isInvalid={!!error}>
                    <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
                    <Field
                        as={Input}
                        id={field.name}
                        name={field.name}
                        type={props.type ? props.type : 'text'}
                        variant="filled"
                        placeholder={props.placeholder}

                    />
                    {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
                </FormControl>
            )}

        </FormControl>
    );
}