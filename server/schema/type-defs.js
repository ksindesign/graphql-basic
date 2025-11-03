const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String! # name is required
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
    favoriteMovies: [Movie]
    isInTheaters: Boolean
  }

  type Movie {
    id: ID!
    name: String!
    yearOfPublication: Int!
    isInTheaters: Boolean!
  }

  type Query {
    users: UsersResult!
    user(id: ID!): User!
    movies: [Movie!]!
    movie(name: String!): Movie!
  }

  input CreateUserInput {
    name: String!
    username: String!
    age: Int!
    nationality: Nationality = HONGKONG
  }

  input UpdateUsernameInput {
    id: ID!
    newUsername: String!
  }

  input DeleteUserInput {
    id: ID!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUsername(input: UpdateUsernameInput!): User
    deleteUser(input: DeleteUserInput!): User
  }

  # verify nationalities for the users
  enum Nationality {
    CANADA
    CHINA
    GERMANY
    AMERICA
    INDIA
    BRAZIL
    CHILE
    HONGKONG
  }

  type UsersSuccessfulResult {
    users: [User!]!
  }

  type UsersErrorResult {
    message: String!
  }

  union UsersResult = UsersSuccessfulResult | UsersErrorResult
`;

module.exports = { typeDefs };
