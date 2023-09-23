//REMEMBER:
//The main difference between client and server URQL code are the IMPORTS.
//I don not know exactly why but otherwise it does not work properly
//This is how it is done in the official documentation
import { fetchExchange, createClient, SSRExchange, Exchange } from '@urql/next';
import { cacheExchange } from '@urql/exchange-graphcache';
import { } from "@urql/core";
import { betterUpdateQuery } from './betterUpdateQuery';
import { LoginMutation, UserQuery, UserDocument, RegisterMutation, LogoutMutation } from '@/graphql/operations';
import { pipe, tap } from "wonka";
import { useRouter } from 'next/navigation';
import { useUserQuery } from '@/graphql/queries/user.hooks';
import { useEffect } from 'react';
import useIsAuth from './useIsAuth';


export const errorExchange: Exchange = ({ forward }) => (ops$) => {
    //useRouter now woks, but only if you remove useMemo when calling getUrqlClient in providers
    const router = useRouter();

    return pipe(
        forward(ops$),
        tap(value => {
            const { error } = value
            if (error?.message.includes("not logged in")) {
                /* 
                this is the only way I was able to make this work without useRouter hook
                but, this way is worse since Next router is faster
                this should only be used when you want to refresh the page
                
                window.location.pathname = "/login";
                */

                //use next.js router that does not refresh the page
                router.push("/login")

            }
        }),
    )
};

export const getUrqlClient = (ssr: SSRExchange) => {
    return createClient({
        url: 'http://localhost:4000/',
        //Cookies do not get set without this line.
        fetchOptions: {
            credentials: "include" as const,
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
                    },
                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, UserQuery>(
                            cache,
                            { query: UserDocument },
                            _result,
                            () => (
                                { user: null }
                            )
                        )
                    }
                }
            }
        }), ssr, errorExchange, fetchExchange],
    });
}
//export const { getClient } = registerUrql(getUrqlClient);