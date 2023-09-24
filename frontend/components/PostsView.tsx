"use client"

import { usePostsQuery } from "@/graphql/queries/posts.hooks";
import { Post } from "@/graphql/types";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react"
import { randomInt, randomUUID } from "crypto";
import { useState } from "react";


interface PostsData {
    initialPosts: {
        posts: {
            posts: Post[];
        }
    };
}

const PostsView = ({ initialPosts }: PostsData) => {
    const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string });
    //we load additional data on the client after
    const [{ data, fetching }] = usePostsQuery({
        variables
    });
    //console.log(data);

    const increaseLimit = () => {
        const newLimit = variables.limit + 10;
        const newCursor = data?.posts.posts[data.posts.posts.length - 1].createdAt
        //console.log(data?.posts);
        setVariables({ cursor: newCursor, limit: newLimit });
    };

    return (
        //initial data passed from the server
        //and new data dinamicly fetched on the client
        <Stack direction={"column"} spacing={"24px"}>
            {initialPosts.posts.posts.map((post: Post) => (
                <Box key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
                    <Heading fontSize={"xl"}>{post.title}</Heading>
                    <Text mt={4}>{post.textSnippet} ...</Text>
                </Box>
            ))}
            {!initialPosts && (
                <div>loading server data</div>
            )}


            {data && !fetching && data.posts.posts.map((post) => (
                <Box key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
                    <Heading fontSize={"xl"}>{post.title}</Heading>
                    <Text mt={4}>{post.textSnippet} ...</Text>
                </Box>
            ))}
            {fetching && (
                <div>loading client data</div>
            )}
            {data && data.posts.hasMore && (
                <Button onClick={increaseLimit}>Load more...</Button>
            )}
        </Stack>
    );
}

export default PostsView