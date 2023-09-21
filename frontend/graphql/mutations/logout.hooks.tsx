import * as Types from '../types';

import * as Operations from '@/graphql/operations';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export function useLogoutMutation() {
  return Urql.useMutation<Operations.LogoutMutation, Operations.LogoutMutationVariables>(Operations.LogoutDocument);
};