
import { debugExchange, fetchExchange, createClient, ssrExchange } from '@urql/next';
import { cacheExchange } from '@urql/exchange-graphcache';
import { registerUrql } from '@urql/next/rsc';
import { LoginMutation, LogoutMutation, RegisterMutation, User, UserDocument, UserQuery } from '@/generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';


const makeClient = () => {
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
        }), fetchExchange],
    });
};


export const { getClient } = registerUrql(makeClient);