"use client"
import { InputField } from "@/components/InputField";
import { Wrapper } from "@/components/Wrapper";
import { useForgotPasswordMutation } from "@/graphqlApollo/generated";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Formik } from "formik";
import { useEffect, useState } from "react";



export const ForgotPasswordPage: React.FC<{}> = ({ }) => {
    const [mouted, setMouted] = useState(false);
    const [complete, setComplet] = useState(false);
    useEffect(() => {
        setMouted(true);
    }, [])

    const [forgotPassword] = useForgotPasswordMutation();

    return (
        mouted && (
            <Wrapper variant='regular'>
                <Formik
                    initialValues={{
                        email: "",
                    }}
                    onSubmit={async (values) => {
                        await forgotPassword({ variables: values });
                        setComplet(true);

                    }}
                >
                    {({ handleSubmit, isSubmitting }) => complete ? <Box>Check your email to continue</Box> : (
                        <form onSubmit={handleSubmit}>
                            <VStack p={50}>
                                <InputField
                                    name='email'
                                    label='Email'
                                    placeholder='Email'
                                />
                                <Button type="submit" colorScheme="purple" width="full" mt={4} isLoading={isSubmitting}>
                                    Send recovery email
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </Wrapper>
        )

    )
}
export default ForgotPasswordPage;