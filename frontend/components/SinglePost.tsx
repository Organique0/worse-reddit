import { useVoteMutation } from '@/graphql/mutations/vote.hooks';
import { Post, PostWithUser } from '@/graphql/types';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { Box, Button, Flex, Heading, Icon, IconButton, Stack, Text } from "@chakra-ui/react"
import { useState } from 'react';


const SinglePost = ({ post }: { post: PostWithUser }) => {
    const [loading, setLoading] = useState<"up-loading" | "down-loading" | "not-loading">("not-loading")
    const [{ fetching, operation }, vote] = useVoteMutation();
    return (
        <Flex key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
            <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
                <IconButton aria-label='up-vote' icon={<ChevronUpIcon />} onClick={async () => {
                    setLoading("up-loading");
                    await vote({
                        postId: post.id,
                        value: 1
                    })
                    setLoading("not-loading")
                }} isLoading={loading === "up-loading"} />
                {post.points}
                <IconButton aria-label='down-vote' icon={<ChevronDownIcon />} onClick={async () => {
                    setLoading("down-loading");
                    await vote({
                        postId: post.id,
                        value: -1
                    })
                    setLoading("not-loading");
                }} isLoading={loading === "down-loading"} />
            </Flex>
            <Box>
                <Heading fontSize={"xl"}>{post.title}</Heading>
                <Text>Posted by: {post.user.username}</Text>
                <Text mt={4}>{post.textSnippet} ...</Text>
            </Box>
        </Flex>
    )
}

export default SinglePost