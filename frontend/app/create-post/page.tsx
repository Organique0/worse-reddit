"use client"
import { InputField } from '@/components/InputField';
import { Wrapper } from '@/components/Wrapper';
import { useCreatePostMutation } from '@/graphql/mutations/createPost.hooks';
import { useLoginMutation } from '@/graphql/mutations/login.hooks';
import { toErrorMap } from '@/utils/toErrorMap';
import { VStack, Button, Box, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from "next/link";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CreatePost: React.FC<{}> = ({ }) => {

    const [mouted, setMouted] = useState(false);
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();

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
                        await createPost({ input: values });
                        router.push("/");
                        console.log(values);
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