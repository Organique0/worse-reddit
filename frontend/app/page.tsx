import PostsView from '@/components/PostsView';
import { PostsDocument, VoteMutation, VoteMutationVariables } from '@/graphql/operations';
import { getClient } from '@/utils/createUrqlServer';
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import Link from 'next/link';
import gql from 'graphql-tag';
export const revalidate = 0;

export default async function Home() {
  //If I am not mistaken, this is how you get client in a server component

  //you can fetch the posts on the server
  //I do not know how to update cache if this is used this way

  /*   const client = getClient();
    const { data } = await client.query(PostsDocument,
      {
        "limit": 0,
        "cursor": null,
      }
    ); */
  //initialPosts={data}
  return (
    <div style={{ width: "100%" }}>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={"3em"}>
        <Heading>worse reddit</Heading>
        <Button>
          <Link href={"/create-post"}>create post</Link>
        </Button>
      </Flex>
      <PostsView />
    </div>

  )
}

function Loading() {
  return <h2>Loading...</h2>;
}