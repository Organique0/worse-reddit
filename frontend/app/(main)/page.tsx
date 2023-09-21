import { PostsDocument } from '@/graphql/operations';
import { getClient } from '@/utils/createUrqlServer';


export default async function Home() {
  const client = getClient();
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