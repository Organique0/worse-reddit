import PostsView from '@/components/PostsView';
import { Flex, Heading } from '@chakra-ui/react'

export const revalidate = 0;

export default async function Home() {


  return (
    <div style={{ width: "100%" }}>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={"3em"}>
        <Heading>Latest posts</Heading>
      </Flex>
      <PostsView />
    </div>

  )
}

function Loading() {
  return <h2>Loading...</h2>;
}