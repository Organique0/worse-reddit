"use client"
import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    VStack,
} from '@chakra-ui/react'
import { Field, Formik } from 'formik';
import { Wrapper } from '@/components/Wrapper';
import { InputField } from '@/components/InputField';
import { toErrorMap } from '@/utils/toErrorMap';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/graphqlApollo/generated';

interface pageProps {

}


const Register: React.FC<pageProps> = ({ }) => {
    const [mouted, setMouted] = useState(false);
    const [register,] = useRegisterMutation();
    const router = useRouter();

    useEffect(() => {
        setMouted(true);
    }, []);


    return (
        (mouted && (
            <Wrapper variant='regular'>
                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        password: "",
                    }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await register({ variables: { options: values } });
                        if (response.data?.register.errors) {
                            setErrors(toErrorMap(response.data.register.errors))
                        } else if (response.data?.register.user) {
                            router.push("/");
                        }

                    }}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack p={50}>
                                <InputField
                                    name='username'
                                    label='Username'
                                    placeholder='username'
                                />
                                <Box mt={4} width={'full'}>
                                    <InputField
                                        name='email'
                                        label='Email'
                                        placeholder='email'
                                        type='email'
                                    />
                                    <InputField
                                        name='password'
                                        label='Password'
                                        placeholder='password'
                                        type='password'
                                    />
                                </Box>
                                <Button type="submit" colorScheme="purple" width="full" mt={4} isLoading={isSubmitting}>
                                    Register
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </Wrapper>
        ))
    );
}

export default Register;