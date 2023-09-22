"use client"
import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    VStack,
} from '@chakra-ui/react'
import { Formik } from 'formik';
import { Wrapper } from '@/components/Wrapper';
import { InputField } from '@/components/InputField';
import { useLoginMutation } from '@/graphql/mutations/login.hooks';
import { toErrorMap } from '@/utils/toErrorMap';
import { useRouter } from 'next/navigation';

interface pageProps {

}


const Login: React.FC<pageProps> = ({ }) => {
    const [mouted, setMouted] = useState(false);
    const [, login] = useLoginMutation();
    const router = useRouter();

    useEffect(() => {
        setMouted(true);
    }, []);


    return (
        (mouted && (
            <Wrapper variant='regular'>
                <Formik
                    initialValues={{
                        usernameOrEmail: "",
                        password: "",
                    }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await login(values);
                        if (response.data?.login.errors) {
                            setErrors(toErrorMap(response.data.login.errors))
                        } else if (response.data?.login.user) {
                            router.push("/");
                        }
                    }}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack p={50}>
                                <InputField
                                    name='usernameOrEmail'
                                    label='Username or email'
                                    placeholder='usernameOrEmail'
                                />
                                <Box mt={4} width={'full'}>
                                    <InputField
                                        name='password'
                                        label='Password'
                                        placeholder='password'
                                        type='password'
                                    />
                                </Box>
                                <Button type="submit" colorScheme="purple" width="full" mt={4} isLoading={isSubmitting}>
                                    Login
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </Wrapper>
        ))
    );
}

export default Login;