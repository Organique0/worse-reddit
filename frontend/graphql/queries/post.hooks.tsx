import * as Types from '../types';

import * as Operations from '@/graphql/operations';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export function usePostQuery(options: Omit<Urql.UseQueryArgs<Operations.PostQueryVariables>, 'query'>) {
  return Urql.useQuery<Operations.PostQuery, Operations.PostQueryVariables>({ query: Operations.PostDocument, ...options });
};