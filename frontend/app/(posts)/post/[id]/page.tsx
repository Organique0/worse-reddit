"use client"

import { EditDeletePostButtons } from "@/components/EditDeletePostButtons";
import { usePostQuery } from "@/graphqlApollo/generated";

import { Box, Heading } from "@chakra-ui/react";

const Post = ({ params }: { params: { id: string } }) => {
    const id = parseInt(params.id);

    const { loading, error, data } = usePostQuery({ variables: { postId: id } });

    if (error) {
        return <div>{error.message}</div>;
    }


    if (!data?.post) {
        return (
            <div>could not find post</div>
        )
    }


    return (

        <Box>
            <Heading mb={4}>{data?.post.title}</Heading>
            <Box mb={4}>{data.post.text}</Box>
            <EditDeletePostButtons userId={data.post.user.id} id={data.post.id} />

        </Box>

    )
}

export default Post