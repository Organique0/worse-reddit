import * as Types from '../types';

import * as Operations from '@/graphql/operations';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export function useUserQuery(options?: Omit<Urql.UseQueryArgs<Operations.UserQueryVariables>, 'query'>) {
  return Urql.useQuery<Operations.UserQuery, Operations.UserQueryVariables>({ query: Operations.UserDocument, ...options });
};