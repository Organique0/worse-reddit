import * as Types from '../types';

import * as Operations from '@/graphql/operations';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export function useForgotPasswordMutation() {
  return Urql.useMutation<Operations.ForgotPasswordMutation, Operations.ForgotPasswordMutationVariables>(Operations.ForgotPasswordDocument);
};