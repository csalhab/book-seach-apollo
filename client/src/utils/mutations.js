import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedBooks {
          _id
          authors
          description
          bookId
          image
          title
        }
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook(
    $bookId: String!
    $authors: [String]!
    $title: String!
    $description: String!
    $image: String!
  ) {
    saveBook(
      bookId: $bookId
      authors: $authors
      title: $title
      description: $description
      image: $image
    ) {
      savedBooks {
        bookId
        authors
        title
        description
        image
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      user {
        _id
      }
    }
  }
`;
