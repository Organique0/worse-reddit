"use client"

import { usePostsQuery } from "@/graphql/queries/posts.hooks";
import { Post, PostWithUser } from "@/graphql/types";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react"
import { randomInt, randomUUID } from "crypto";
import { useState } from "react";
import SinglePost from "./SinglePost";


/* interface PostsData {
    initialPosts: {
        posts: {
            posts: PostWithUser[];
        }
    };
} */
// { initialPosts }: PostsData
const PostsView = () => {
    const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string });
    //we load additional data on the client after
    const [{ data, fetching, }] = usePostsQuery({
        variables
    });
    //console.log(data);

    const increaseLimit = () => {
        const newLimit = variables.limit + 10;
        const newCursor = data?.posts.posts[data.posts.posts.length - 1].createdAt
        setVariables({ cursor: null, limit: newLimit });
    };


    return (
        //initial data passed from the server
        //and new data dinamicly fetched on the client
        <Stack direction={"column"} spacing={"24px"}>
            {/*             {initialPosts?.posts.posts.map((post) => (
                <SinglePost post={post} key={post.id} />
            ))}
            {!initialPosts && (
                <div>loading server data</div>
            )} */}

            {data && !fetching && data.posts.posts.map((post) => (
                <SinglePost post={post} key={post.id} />
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