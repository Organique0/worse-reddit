//REMEMBER:
//The main difference between client and server URQL code are the IMPORTS.
//I don not know exactly why but otherwise it does not work properly
//This is how it is done in the official documentation
import { createClient, fetchExchange } from '@urql/core';
import { registerUrql } from '@urql/next/rsc';
import { NullArray, Resolver, cacheExchange } from '@urql/exchange-graphcache';
import { stringifyVariables } from '@urql/core';
import { VoteMutationVariables } from '@/graphql/operations';
import gql from 'graphql-tag';

const getUrlServer = () => {
    return createClient({
        url: process.env.ENV == "production" ? 'https://worsereddit.azurewebsites.net/' : "http://localhost:4000/", // 'http://localhost:4000/',
        //Cookies do not get set without this line.
        fetchOptions: {
            credentials: "include" as const,
        },
        exchanges: [cacheExchange({

            updates: {
                Mutation: {
                    /*                     vote: (_result, args, cache, info) => {
                                            const { postId, value } = args as VoteMutationVariables
                                            const data = cache.readFragment(gql`
                                                fragment _ on PostWithUser {
                                                    id
                                                    points
                                                }
                                                `, { id: postId, points: value });
                                            console.log(data);
                                            if (data) {
                                                const newPoints = (data.points as number) + value;
                                                cache.writeFragment(gql`
                                                 fragment __ on PostWithUser {
                                                   points
                                                    }
                                                  `, { id: postId, points: newPoints })
                                            }
                    
                                        }, */
                }
            },
            resolvers: {
                Query: {
                    posts: simplePagination()
                }
            },
        }), fetchExchange],
    });
};

export const { getClient } = registerUrql(getUrlServer);



type MergeMode = 'before' | 'after';
interface PaginationParams {
    /** The name of the field argument used to define the page’s offset. */
    offsetArgument?: string;
    /** The name of the field argument used to define the page’s length. */
    limitArgument?: string;
    /** Flip between forward and backwards pagination.
     *
     * @remarks
     * When set to `'after'`, its default, pages are merged forwards and in order.
     * When set to `'before'`, pages are merged in reverse, putting later pages
     * in front of earlier ones.
     */
    mergeMode?: MergeMode;
}

const simplePagination = (): Resolver<any, any, any> => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        //console.log(entityKey, fieldName); => Query posts

        const allFields = cache.inspectFields(entityKey);
        //console.log(allFields);
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
        const isInCache = cache.resolve(entityKey, fieldKey);
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        const results: string[] = [];
        fieldInfos.forEach(info => {
            const data = cache.resolve(entityKey, info.fieldKey) as string[]
            results.push(...data);
        })

        return results;

    };
};