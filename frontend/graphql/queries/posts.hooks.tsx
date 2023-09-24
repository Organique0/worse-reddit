import * as Types from '../types';

import * as Operations from '@/graphql/operations';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export function usePostsQuery(options: Omit<Urql.UseQueryArgs<Operations.PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<Operations.PostsQuery, Operations.PostsQueryVariables>({ query: Operations.PostsDocument, ...options });
};