import { PostsDocument } from '@/graphql/operations';
import { getClient } from '@/utils/createUrqlServer';
import { Box } from '@chakra-ui/react';
import Link from 'next/link';

export const revalidate = 0;

export default async function Home() {
  //If I am not mistaken, this is how you get client in a server component
  const client = getClient();
  const { data, error } = await client.query(PostsDocument, {});
  return (


    <div style={{ height: "300vh" }}>
      <Link href={"/create-post"}>create post</Link>
      {data.posts.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>

  )
}

function Loading() {
  return <h2>Loading...</h2>;
}