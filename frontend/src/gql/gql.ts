/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation changePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    createdAt\n    id\n    title\n    updatedAt\n    userId\n    text\n  }\n}": types.CreatePostDocument,
    "mutation deletePost($id: Int!) {\n  deletePost(id: $id)\n}": types.DeletePostDocument,
    "mutation forgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}": types.ForgotPasswordDocument,
    "mutation Login($password: String!, $usernameOrEmail: String!) {\n  login(password: $password, usernameOrEmail: $usernameOrEmail) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      username\n      updatedAt\n      id\n      email\n      createdAt\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpdatePost($updatePostId: Int!, $text: String!, $title: String!) {\n  updatePost(id: $updatePostId, text: $text, title: $title) {\n    id\n    title\n    text\n    textSnippet\n  }\n}": types.UpdatePostDocument,
    "mutation Vote($value: Int!, $postId: Int!) {\n  vote(value: $value, postId: $postId)\n}": types.VoteDocument,
    "query Post($postId: Int!) {\n  post(id: $postId) {\n    id\n    points\n    user {\n      username\n      id\n    }\n    voteStatus\n    updatedAt\n    title\n    textSnippet\n    text\n    createdAt\n  }\n}": types.PostDocument,
    "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    posts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      voteStatus\n      user {\n        username\n        id\n      }\n      points\n      textSnippet\n    }\n    hasMore\n    _id\n  }\n}": types.PostsDocument,
    "query User {\n  user {\n    username\n    updatedAt\n    posts {\n      text\n      title\n      updatedAt\n      userId\n      id\n      createdAt\n    }\n    id\n    email\n    createdAt\n  }\n}": types.UserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation changePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}"): (typeof documents)["mutation changePassword($newPassword: String!, $token: String!) {\n  changePassword(newPassword: $newPassword, token: $token) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    createdAt\n    id\n    title\n    updatedAt\n    userId\n    text\n  }\n}"): (typeof documents)["mutation CreatePost($input: PostInput!) {\n  createPost(input: $input) {\n    createdAt\n    id\n    title\n    updatedAt\n    userId\n    text\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation deletePost($id: Int!) {\n  deletePost(id: $id)\n}"): (typeof documents)["mutation deletePost($id: Int!) {\n  deletePost(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation forgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"): (typeof documents)["mutation forgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($password: String!, $usernameOrEmail: String!) {\n  login(password: $password, usernameOrEmail: $usernameOrEmail) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}"): (typeof documents)["mutation Login($password: String!, $usernameOrEmail: String!) {\n  login(password: $password, usernameOrEmail: $usernameOrEmail) {\n    errors {\n      field\n      message\n    }\n    user {\n      createdAt\n      email\n      id\n      updatedAt\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      username\n      updatedAt\n      id\n      email\n      createdAt\n    }\n  }\n}"): (typeof documents)["mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      field\n      message\n    }\n    user {\n      username\n      updatedAt\n      id\n      email\n      createdAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePost($updatePostId: Int!, $text: String!, $title: String!) {\n  updatePost(id: $updatePostId, text: $text, title: $title) {\n    id\n    title\n    text\n    textSnippet\n  }\n}"): (typeof documents)["mutation UpdatePost($updatePostId: Int!, $text: String!, $title: String!) {\n  updatePost(id: $updatePostId, text: $text, title: $title) {\n    id\n    title\n    text\n    textSnippet\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Vote($value: Int!, $postId: Int!) {\n  vote(value: $value, postId: $postId)\n}"): (typeof documents)["mutation Vote($value: Int!, $postId: Int!) {\n  vote(value: $value, postId: $postId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($postId: Int!) {\n  post(id: $postId) {\n    id\n    points\n    user {\n      username\n      id\n    }\n    voteStatus\n    updatedAt\n    title\n    textSnippet\n    text\n    createdAt\n  }\n}"): (typeof documents)["query Post($postId: Int!) {\n  post(id: $postId) {\n    id\n    points\n    user {\n      username\n      id\n    }\n    voteStatus\n    updatedAt\n    title\n    textSnippet\n    text\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    posts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      voteStatus\n      user {\n        username\n        id\n      }\n      points\n      textSnippet\n    }\n    hasMore\n    _id\n  }\n}"): (typeof documents)["query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    posts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      voteStatus\n      user {\n        username\n        id\n      }\n      points\n      textSnippet\n    }\n    hasMore\n    _id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query User {\n  user {\n    username\n    updatedAt\n    posts {\n      text\n      title\n      updatedAt\n      userId\n      id\n      createdAt\n    }\n    id\n    email\n    createdAt\n  }\n}"): (typeof documents)["query User {\n  user {\n    username\n    updatedAt\n    posts {\n      text\n      title\n      updatedAt\n      userId\n      id\n      createdAt\n    }\n    id\n    email\n    createdAt\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;