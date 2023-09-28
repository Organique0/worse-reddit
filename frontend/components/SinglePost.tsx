import { Post, PostWithUser } from '@/graphql/types';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { Box, Button, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react"


const SinglePost = ({ post }: { post: PostWithUser }) => {
    return (
        <Flex key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
            <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
                <ChevronUpIcon name='chevron-up' fontSize="24px" onClick={() => console.log("d")} />
                {post._count?.updoods}
                <ChevronDownIcon name='chevron-down' fontSize="24px" />
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