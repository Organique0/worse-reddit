"use client"
import { InputField } from '@/components/InputField';
import { Wrapper } from '@/components/Wrapper';
import { useCreatePostMutation } from '@/graphqlApollo/generated';

import { toErrorMap } from '@/utils/toErrorMap';
import useIsAuth from '@/utils/useIsAuth';
import { VStack, Button, Box } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CreatePost: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [mouted, setMouted] = useState(false);
    const [createPost] = useCreatePostMutation();
    //auto redirect if not logged in
    useIsAuth();

    useEffect(() => {
        setMouted(true);
    }, []);
    return (
        (mouted && (
            <Wrapper variant='regular'>
                <Formik
                    initialValues={{
                        title: "",
                        text: "",
                    }}
                    onSubmit={async (values) => {
                        const { errors } = await createPost({ variables: { input: values } });
                        if (!errors) {
                            router.push("/");
                        }
                        //console.log(values);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <VStack p={50}>
                                <InputField
                                    name='title'
                                    label='Title'
                                    placeholder='Title'
                                />
                                <Box mt={4} width={'full'}>
                                    <InputField
                                        name='text'
                                        label='Body'
                                        placeholder='Text...'
                                        textarea={true}
                                    />
                                </Box>
                                <Button type="submit" colorScheme="purple" width="full" mt={4} isLoading={isSubmitting}>
                                    Create post
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        ))
    );
}

export default CreatePost