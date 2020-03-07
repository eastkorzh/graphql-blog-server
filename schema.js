const { gql } = require('apollo-server');

const typeDefs = gql`
  type Photo {
    url: String
    id: ID!
  }

  type Post {
    _id: ID!
    title: String!
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
    token: String
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
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
      title: String!
      description: String
      content: String!
    ): Post
    editPost(
      id: ID!
      title: String
      description: String
      content: String
    ): Post    
    deletePost(
      id: ID!
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
