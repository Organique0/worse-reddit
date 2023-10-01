"use client"
import { InputField } from "@/components/InputField";
import { Wrapper } from "@/components/Wrapper";
import { usePostQuery, useUpdatePostMutation } from "@/graphqlApollo/generated";
import useIsAuth from "@/utils/useIsAuth";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditPostPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [mouted, setMouted] = useState(false);
    const [updatePost] = useUpdatePostMutation();

    const { data } = usePostQuery({
        variables: {
            postId: parseInt(params.id)
        }
    })

    //auto redirect if not logged in
    useIsAuth();

    useEffect(() => {
        setMouted(true);
    }, []);


    if (!data?.post) {
        return (
            <div>could not find</div>
        )
    }
    return (
        (mouted && (
            <Wrapper variant='regular'>
                <Formik
                    initialValues={{
                        title: data.post.title,
                        text: data.post.text,
                    }}
                    onSubmit={async (values) => {
                        const { errors } = await updatePost({ variables: { updatePostId: (data?.post?.id)!, ...values } });

                        router.back();
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
                                    Update post
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        ))
    );
}

export default EditPostPage