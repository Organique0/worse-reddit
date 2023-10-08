//REMEMBER:
//The main difference between client and server URQL code are the IMPORTS.
//I don not know exactly why but otherwise it does not work properly
//This is how it is done in the official documentation
import { fetchExchange, createClient, SSRExchange, Exchange, stringifyVariables } from '@urql/next';
import { Resolver, cacheExchange, Cache } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from './betterUpdateQuery';
import { LoginMutation, UserQuery, UserDocument, RegisterMutation, LogoutMutation, VoteMutationVariables, PostsDocument, PostDocument, DeletePostMutation, DeletePostMutationVariables } from '@/graphql/operations';
import { pipe, tap } from "wonka";
import { useRouter } from 'next/navigation';
import gql from 'graphql-tag';
//since when we get the user, we also get the posts.
//and because the types for login and register are broken
//we need to hack our way around this so that we don't get any red underlines that drive me crazy
//we could also make this work better in general, but no.
type UserQueryWithoutPosts = Omit<UserQuery, 'user'> & {
    user?: Omit<UserQuery['user'], 'posts'> | null | undefined;
};

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
    //useRouter now woks, but only if you remove useMemo when calling getUrqlClient in providers
    const router = useRouter();

    return pipe(
        forward(ops$),
        tap(value => {
            const { error } = value
            if (error?.message.includes("not logged in")) {
                /* 
               without useRouter hook
                but, this way is worse, since Next router is faster
                this should only be used when you want to refresh the page
                
                window.location.pathname = "/login";
                */

                //use next.js router that does not refresh the page
                router.push("/login")

            }
        }),
    )
};

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
    fieldInfos.forEach((info) => {
        cache.invalidate("Query", 'posts', info.arguments)
    })
}

export const getUrqlClient = (ssr: SSRExchange) => {
    return createClient({

        url: 'https://worse-reddit.azurewebsites.net/',
        //Cookies do not get set without this line.
        fetchOptions: {
            credentials: "include" as const,
        },

        exchanges: [cacheExchange({
            keys: {
                PaginatedPosts: () => null,
            },
            resolvers: {
                Query: {
                    posts: simplePagination()
                }
            },
            updates: {

                Mutation: {
                    createPost: (_result, args, cache, info) => {
                        invalidateAllPosts(cache);
                    },
                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, UserQueryWithoutPosts>(
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
                        );
                        invalidateAllPosts(cache);
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, UserQueryWithoutPosts>(
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
                        invalidateAllPosts(cache);
                    },
                    vote: (_result, args, cache, info) => {
                        type MyPostFragment = {
                            __typename?: "MyPost";
                            id: number;
                            points?: number;
                            voteStatus?: number | null;
                        };

                        const { postId, value } = args as VoteMutationVariables
                        const data = cache.readFragment<MyPostFragment>(gql`
                            fragment _ on MyPost {
                                id
                                points
                                voteStatus
                            }
                            `, { id: postId });
                        if (data) {
                            if (data.voteStatus === value) {
                                return;
                            }
                            const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                            cache.writeFragment(gql`
                             fragment __ on MyPost {
                               points
                               voteStatus
                                }
                              `, { id: postId, points: newPoints, voteStatus: value });
                        }

                    },
                    deletePost: (_result, args, cache, info) => {
                        cache.invalidate({ __typename: "MyPost", id: (args as DeletePostMutationVariables).id, })
                    }
                },

            }
        }), errorExchange, fetchExchange],
    });
}
//export const { getClient } = registerUrql(getUrqlClient);


const simplePagination = (): Resolver<any, any, any> => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        //console.log(entityKey, fieldName); => Query posts

        const allFields = cache.inspectFields(entityKey);
        /*
        [
            {
                fieldKey: 'posts({"cursor":"2023-09-23T20:38:10.505Z","limit":50})',
                fieldName: 'posts',
                arguments: { cursor: '2023-09-23T20:38:10.505Z', limit: 50 }
            }
        ]
        */
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isInCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
        info.partial = !isInCache;


        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);

        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        let hasMore = true;

        let results: string[] = [];
        /* 
                const lastFieldInfo = fieldInfos[fieldInfos.length - 1]; // Get the last fieldInfo
                if (lastFieldInfo) {
                    const key = cache.resolve(entityKey, lastFieldInfo.fieldKey) as string;
                    const data = cache.resolve(key, "posts") as string[];
                    const _hasMore = cache.resolve(key, "hasMore");
        
                    if (!_hasMore) {
                        hasMore = _hasMore as boolean;
                    }
        
                    if (data.length > 0) {
                        // Append the new data to the existing results
                        results.push(...data);
        
                    }
                } */





        fieldInfos.forEach(info => {
            //console.log(info)
            const key = cache.resolve(entityKey, info.fieldKey) as string;
            const data = cache.resolve(key, "posts") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }

            results.push(...data);
        });

        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results,
        };

    };
};