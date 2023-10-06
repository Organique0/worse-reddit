import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { PaginatedPosts } from '@/graphqlApollo/generated';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: ["limit"],
              merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts, { mergeObjects }): PaginatedPosts {
                return mergeObjects(existing, incoming);
              },
            },
          },
        },
      },
    }),
    link: new HttpLink({
      uri: 'http://localhost:4000/',
      credentials: "include",


      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    }),
  });
}); 