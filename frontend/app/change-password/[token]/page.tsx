"use client";
import { InputField } from "@/components/InputField";
import { Wrapper } from "@/components/Wrapper";
import { useChangePasswordMutation } from "@/graphql/mutations/changePassword.hooks";
import { useLogoutMutation } from "@/graphql/mutations/logout.hooks";
import { LogoutDocument } from "@/graphql/operations";
import { isServer } from "@/utils/isServer";
import { toErrorMap } from "@/utils/toErrorMap";
import { VStack, Button, Box, Link, Flex } from "@chakra-ui/react";
import { Formik } from "formik";
import { NextPage } from "next"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NextLink from "next/link";

const ChangePassword = ({ params }: { params: { token: string } }) => {
    const { token } = params;
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');
    const [, ChangePassword] = useChangePasswordMutation();
    const [mouted, setMouted] = useState(false);
    useEffect(() => {
        setMouted(true);
    }, []);

    return (
        (mouted && <Wrapper variant='regular'>
            <Formik
                initialValues={{
                    newPassword: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await ChangePassword({
                        newPassword: values.newPassword,
                        token
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {({ handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack p={50}>
                            <InputField
                                name='newPassword'
                                label='New password'
                                placeholder='password'
                                type='password'
                            />
                            {tokenError ? (
                                <Flex>
                                    <Box mr={2}>{tokenError}</Box>
                                    <NextLink href="/forgot-password">
                                        <Link>Get a new token</Link>
                                    </NextLink>
                                </Flex>

                            ) : null}
                            <Button type="submit" colorScheme="purple" width="full" mt={4} isLoading={isSubmitting}>
                                Change password
                            </Button>
                        </VStack>
                    </form>
                )}
            </Formik>
        </Wrapper>)
    )
}

export default ChangePassword