const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID
    authors: String
    description: String
    bookId: Int
    image: String
    link: String
    title: String
  }

  type Query {
    books: [Book]
  }
`;

module.exports = typeDefs;
