import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { getMe, deleteBook, saveBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  //const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  //const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};
  console.log(userData);

  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      try {
        // First we retrieve existing profile data that is stored in the cache under the `QUERY_PROFILES` query
        // Could potentially not exist yet, so wrap in a try/catch
        const { me } = cache.readQuery({ query: GET_ME });
        console.log("inside SavedBooks.js, me: ", me);

        // Then we update the cache by combining existing profile data with the newly created data returned from the mutation
        cache.writeQuery({
          query: GET_ME,
          // If we want new data to show up before or after existing data, adjust the order of this array
          data: { me: removeBook },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //const response = await deleteBook(bookId, token); //removed had been in prior
      //const response = await removeBook(bookId, token); //us trying but not needed
      const { data } = await removeBook({
        variables: { bookId },
      });

      // if (!response.ok) {
      //   throw new Error("something went wrong!");
      // }
      if (!data) {
        throw new Error("something went wrong!");
      }

      //const updatedUser = await response.json();
      //setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
