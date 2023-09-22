import * as Types from '../graphql/types';

import gql from 'graphql-tag';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UserDataFragment = { __typename?: 'User', createdAt: any, id: number, updatedAt: any, username: string };

export type ChangePasswordMutationVariables = Types.Exact<{
  newPassword: Types.Scalars['String']['input'];
  token: Types.Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, email: string, id: number, updatedAt: any, username: string } | null } };

export type ForgotPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Types.Exact<{
  password: Types.Scalars['String']['input'];
  usernameOrEmail: Types.Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, email: string, id: number, updatedAt: any, username: string } | null } };

export type LogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type PostsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', createdAt: any, id: number, text: string, updatedAt: any, title: string }> };

export type RegisterMutationVariables = Types.Exact<{
  options: Types.UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', createdAt: any, id: number, updatedAt: any, username: string } | null } };

export type UserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt: any, id: number, updatedAt: any, username: string } | null };

export const UserDataFragmentDoc = gql`
    fragment UserData on User {
  createdAt
  id
  updatedAt
  username
}
    `;
export const ChangePasswordDocument = gql`
    mutation changePassword($newPassword: String!, $token: String!) {
  changePassword(newPassword: $newPassword, token: $token) {
    errors {
      field
      message
    }
    user {
      createdAt
      email
      id
      updatedAt
      username
    }
  }
}
    `;
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export const LoginDocument = gql`
    mutation Login($password: String!, $usernameOrEmail: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    errors {
      field
      message
    }
    user {
      createdAt
      email
      id
      updatedAt
      username
    }
  }
}
    `;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export const PostsDocument = gql`
    query Posts {
  posts {
    createdAt
    id
    text
    updatedAt
    title
  }
}
    `;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      ...UserData
    }
  }
}
    ${UserDataFragmentDoc}`;
export const UserDocument = gql`
    query User {
  user {
    ...UserData
  }
}
    ${UserDataFragmentDoc}`;