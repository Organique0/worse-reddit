'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import { Client, Provider, fetchExchange, } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { LoginMutation, RegisterMutation, UserDocument, UserQuery } from '@/generated/graphql';

function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

const client = new Client({
    url: 'http://localhost:4000/',
    //Cookies do not get set without this line.
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [cacheExchange({
        updates: {
            Mutation: {
                login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, UserQuery>(
                        cache,
                        { query: UserDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    user: result.login.user
                                }
                            }
                        }
                    )
                },
                register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, UserQuery>(
                        cache,
                        { query: UserDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    user: result.register.user
                                }
                            }
                        }
                    )
                }
            }
        }
    }), fetchExchange],

});

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Provider value={client}>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </CacheProvider>
        </Provider>
    )
}