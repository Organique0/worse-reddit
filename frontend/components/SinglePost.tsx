import { useDeletePostMutation } from '@/graphql/mutations/deletePost.hooks';
import { useVoteMutation } from '@/graphql/mutations/vote.hooks';
import { useUserQuery } from '@/graphql/queries/user.hooks';
import { Post, PostWithUser } from '@/graphql/types';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { Box, Button, Flex, Heading, Icon, IconButton, Stack, Text, color } from "@chakra-ui/react"
import Link from 'next/link';
import { useState } from 'react';
import { EditDeletePostButtons } from './EditDeletePostButtons';


const SinglePost = ({ post }: { post: PostWithUser }) => {
    const [loading, setLoading] = useState<"up-loading" | "down-loading" | "not-loading">("not-loading")
    const [{ fetching, operation }, vote] = useVoteMutation();
    const [, deletePost] = useDeletePostMutation();
    const [{ data: user }] = useUserQuery();

    return (
        <Flex key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
            <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
                <IconButton aria-label='up-vote' icon={<ChevronUpIcon />} onClick={async () => {
                    if (post.voteStatus === 1) return;
                    setLoading("up-loading");
                    try {
                        await vote({
                            postId: post.id,
                            value: 1
                        })
                    } catch (error: any) {
                        alert(error.message)
                    }
                    setLoading("not-loading")
                }} isLoading={loading === "up-loading"} colorScheme={post.voteStatus === 1 ? 'green' : undefined} />
                {post.points}
                <IconButton aria-label='down-vote' icon={<ChevronDownIcon />} onClick={async () => {
                    if (post.voteStatus === -1) return;
                    setLoading("down-loading");
                    try {
                        await vote({
                            postId: post.id,
                            value: -1
                        })
                    } catch (error: any) {
                        alert(error.message);
                    }
                    setLoading("not-loading");
                }} isLoading={loading === "down-loading"} colorScheme={post.voteStatus === -1 ? 'orange' : undefined} />
            </Flex>
            <Box flex={1} ml={3}>
                <Flex justifyContent={"space-between"}>
                    <Link href={"/post/" + post.id}>
                        <Heading fontSize={"xl"}>{post.title}</Heading>
                    </Link>
                    <EditDeletePostButtons id={post.id} userId={post.user.id} />
                </Flex>
                <Text>Posted by: {post.user.username}</Text>
                <Text mt={4}>{post.textSnippet} ...</Text>
            </Box>
        </Flex>
    )
}

export default SinglePost