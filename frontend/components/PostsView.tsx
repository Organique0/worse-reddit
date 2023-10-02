"use client"

import { usePostsQuery } from "@/graphqlApollo/generated";
import { Button, Stack } from "@chakra-ui/react";
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
    const { data, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 10,
            cursor: null as null | string
        },
        notifyOnNetworkStatusChange: true,
    });

    const increaseLimit = () => {
        fetchMore({
            variables: {
                limit: variables?.limit,
                cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    ...prev,
                    posts: {
                        ...prev.posts,
                        posts: [...prev.posts.posts, ...fetchMoreResult.posts.posts],
                        hasMore: fetchMoreResult.posts.hasMore,
                    },
                };
            },
        });
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

            {data && !loading && data.posts.posts.map((post) => !post ? null : (
                <SinglePost post={post} key={post.id} />
            ))}
            {loading && (
                <div>loading client data</div>
            )}
            {data && data.posts.hasMore && (
                <Button onClick={increaseLimit}>Load more...</Button>
            )}
        </Stack>
    );
}

export default PostsView