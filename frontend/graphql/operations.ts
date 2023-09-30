import * as Types from '../graphql/types';

import gql from 'graphql-tag';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ChangePasswordMutationVariables = Types.Exact<{
  newPassword: Types.Scalars['String']['input'];
  token: Types.Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'UserWithPosts', createdAt: any, email: string, id: number, updatedAt: any, username: string } | null } };

export type CreatePostMutationVariables = Types.Exact<{
  input: Types.PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', createdAt: any, id: number, title: string, updatedAt: any, userId: number, text: string } };

export type ForgotPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Types.Exact<{
  password: Types.Scalars['String']['input'];
  usernameOrEmail: Types.Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'UserWithPosts', createdAt: any, email: string, id: number, updatedAt: any, username: string } | null } };

export type LogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Types.Exact<{
  options: Types.UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'UserWithPosts', username: string, updatedAt: any, id: number, email: string, createdAt: any } | null } };

export type VoteMutationVariables = Types.Exact<{
  value: Types.Scalars['Int']['input'];
  postId: Types.Scalars['Int']['input'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type PostQueryVariables = Types.Exact<{
  postId: Types.Scalars['Int']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'PostWithUser', id: number, points: number, voteStatus?: number | null, updatedAt: any, title: string, textSnippet: string, text: string, createdAt: any, user: { __typename?: 'StrippedUser', username: string, id: number } } | null };

export type PostsQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']['input'];
  cursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, _id: number, posts: Array<{ __typename?: 'PostWithUser', id: number, title: string, text: string, createdAt: any, updatedAt: any, voteStatus?: number | null, points: number, textSnippet: string, user: { __typename?: 'StrippedUser', username: string, id: number } }> } };

export type UserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'UserWithPosts', username: string, updatedAt: any, id: number, email: string, createdAt: any, posts: Array<{ __typename?: 'Post', text: string, title: string, updatedAt: any, userId: number, id: number, createdAt: any }> } | null };


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
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    createdAt
    id
    title
    updatedAt
    userId
    text
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
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      username
      updatedAt
      id
      email
      createdAt
    }
  }
}
    `;
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;
export const PostDocument = gql`
    query Post($postId: Int!) {
  post(id: $postId) {
    id
    points
    user {
      username
      id
    }
    voteStatus
    updatedAt
    title
    textSnippet
    text
    createdAt
  }
}
    `;
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    posts {
      id
      title
      text
      createdAt
      updatedAt
      voteStatus
      user {
        username
        id
      }
      points
      textSnippet
    }
    hasMore
    _id
  }
}
    `;
export const UserDocument = gql`
    query User {
  user {
    username
    updatedAt
    posts {
      text
      title
      updatedAt
      userId
      id
      createdAt
    }
    id
    email
    createdAt
  }
}
    `;