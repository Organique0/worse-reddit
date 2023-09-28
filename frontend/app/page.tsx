import PostsView from '@/components/PostsView';
import { PostsDocument } from '@/graphql/operations';
import { getClient } from '@/utils/createUrqlServer';
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import Link from 'next/link';

export const revalidate = 0;

export default async function Home() {
  //If I am not mistaken, this is how you get client in a server component

  //you can fetch the posts on the server
  const client = getClient();
  const { data } = await client.query(PostsDocument,
    {
      "limit": 20,
      "cursor": null,
    }
  );

  //console.log(data.posts.posts[0].user.username);


  return (
    <div style={{ width: "100%" }}>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={"3em"}>
        <Heading>worse reddit</Heading>
        <Button>
          <Link href={"/create-post"}>create post</Link>
        </Button>
      </Flex>
      <PostsView initialPosts={data} />
    </div>

  )
}

function Loading() {
  return <h2>Loading...</h2>;
}