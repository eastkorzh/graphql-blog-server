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
    date: String
    author: User
  }

  type User {
    _id: ID!
    name: String
    email: String
    avatar: String
    posts: [Post]
    drafts: [Post]
    token: String
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post

    drafts: [Post]
    draft(_id: ID!): Post

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

    makeDraft(
      _id: ID!
      title: String!
      content: String!
    ): Post
    updateDraft(
      _id: ID!
      title: String!
      content: String!
    ): Post
    deleteDraft(
      _id: ID!
    ): User
    publishDraft(_id: ID!): User

    editPost(
      id: ID!
      title: String
      description: String
      content: String
    ): Post    
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
