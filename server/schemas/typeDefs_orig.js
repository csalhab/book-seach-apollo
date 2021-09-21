const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: Int
    image: String
    link: String
    title: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Auth {
    _id: ID
    token: String
    user: User
  }

  type Query {
    books: [Book]
    me(id: ID!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      authors: [String]!
      description: String!
      bookId: Int!
      image: String!
      link: String
    ): User
    removeBook(bookId: Int!): User
  }
`;

module.exports = typeDefs;
