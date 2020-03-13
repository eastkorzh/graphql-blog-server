const { gql } = require('apollo-server');

const typeDefs = gql`
  type Photo {
    url: String
    id: ID!
  }

  type Post {
    _id: ID!
    title: String
    description: String
    content: String
    cover: String
    date: String
    author: User
  }

  type Draft {
    _id: ID!
    title: String
    description: String
    content: String
    cover: String
    date: String
    originalPost: ID,
    author: User
  }

  type User {
    _id: ID!
    name: String
    email: String
    avatar: String
    posts: [Post]
    drafts: [Draft]
    token: String
  }

  type Query {
    posts: [Post]
    post(_id: ID!): Post

    drafts: [Draft]
    draft(_id: ID!): Draft

    users: [User]
    user(id: ID!): User
    me: User
    login(
      email: String!
      password: String!
    ): User
  }

  type Mutation {
    register(
      name: String!
      email: String! 
      password: String!
    ): User
    makePost(
      _id: ID!
      title: String!
      content: String!
    ): Post

    createDraft(
      _id: ID!
      title: String
      content: String
    ): Draft
    updateDraft(
      _id: ID!
      title: String
      content: String
      cover: String
    ): Draft
    deleteDraft(
      _id: ID!
    ): User
    publishDraft(_id: ID!): User

    editPost(
      postId: ID!
      draftId: ID!
    ): User    
    deletePost(
      _id: ID!
    ): User
    updateUserName(
      newName: String!
    ): User
    updateUserEmail(
      newEmail: String!
    ): User
    updateUserPassword(
      oldPassword: String!
      newPassword: String!
    ): User
    updateUserAvatar(
      file: Upload!
    ): User
    addPhoto(
      file: Upload!
      id: ID!
    ): Photo
  }
`;

module.exports = typeDefs;
