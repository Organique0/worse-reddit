'use client'

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { useMemo } from 'react';
import { UrqlProvider, ssrExchange } from '@urql/next';
import { getUrqlClient } from '@/utils/createUrqlClient'
import { useRouter } from 'next/navigation';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { PaginatedPosts, PostsQuery } from '@/graphqlApollo/generated';


export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    /*
    this used to be in a useMemo because it says so in documentation
    the problem is that I want to use the useRouter hook inside of getUrqlClient
    and hooks cannot be used inside of another hooks (like useMemo)
    that hook did not have any dependencies
    I don't know useMemo behaves without them
    */
    /*     const [client, ssr] = (() => {
            const ssr = ssrExchange({ isClient: false });
            const client = getUrqlClient(ssr);
    
            return [client, ssr];
        })(); 
        
        <UrqlProvider client={client} ssr={ssr}></UrqlProvider>
        */

    const client = new ApolloClient({
        uri: 'http://localhost:4000/',
        credentials: "include",
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
    });


    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <ApolloProvider client={client}>
                    {children}
                </ApolloProvider>
            </ChakraProvider>
        </CacheProvider>

    )
}