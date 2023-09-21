"use client"
import { PostsDocument, } from "@/graphql/operations";
import { getUrqlClient } from "@/utils/createUrqlClient";

export default async function Home() {
  const client = getUrqlClient();
  const { data, error } = await client.query(PostsDocument, {});
  return (


    <div>
      {data.posts.map((post: any) => post.title)}
    </div>

  )
}

function Loading() {
  return <h2>Loading...</h2>;
}