// Import the necessary functions from Firebase
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  // Check if the user is an admin
  const checkUser = function () {
    if (!localStorage.hasOwnProperty("admin")) {
      navigate("/admin");
    }
  };

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  // Fetch book data from Firestore
  const fetchData = async () => {
    let docRef = doc(db, "books", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBooks(docSnap.data()["books"]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Accept a book request
  const handleAccept = async (book) => {
    try {
      // Step 1: Get the student ID from the book object
      const studentId = book.studId;

      // Step 2: Create a reference to the Firestore document containing users' data
      const studentDocRef = doc(db, "users", "advantech");

      // Step 3: Retrieve the student document snapshot
      const studentDocSnap = await getDoc(studentDocRef);

      // Step 4: Check if the document exists
      if (studentDocSnap.exists()) {
        // Step 5: Update the book status in the user's data
        const userData = studentDocSnap.data()["users"];
        const updatedBooks = userData.map((user) => {
          // Iterate over users' data
          if (user.id === studentId) {
            // If user's ID matches the student ID
            const updatedUserBooks = user.books.map((userBook) => {
              // Iterate over the user's books
              if (userBook.name === book.bookName) {
                // If book name matches the accepted book's name
                return { ...userBook, status: true }; // Update the book status to true (given)
              }
              return userBook;
            });
            return { ...user, books: updatedUserBooks }; // Update user's books array
          }
          return user;
        });

        // Step 6: Update the user document in Firestore
        await setDoc(doc(db, "users", "advantech"), { users: updatedBooks });

        // Step 7: Remove the book from the collection
        const updatedBooksList = books.filter((b) => b !== book);
        await setDoc(doc(db, "books", "advantech"), {
          books: updatedBooksList,
        });

        // Step 8: Logging
        console.log("Book accepted and status updated.");
      }
    } catch (error) {
      // Step 9: Error handling
      console.error("Error accepting book:", error);
    }
  };

  // Reject a book request
  const handleReject = async (book) => {
    try {
      // Delete the book data from Firestore
      const updatedBooksList = books.filter(
        (b) => b.bookName !== book.bookName
      );
      await setDoc(doc(db, "books", "advantech"), { books: updatedBooksList });

      console.log("Book rejected and removed from collection.");
    } catch (error) {
      console.error("Error rejecting book:", error);
    }
  };

  return (
    <>
      <h1 className="text-center">Manage Books</h1>
      <table className="table table-dark table-striped table-hover w-50 mx-auto mt-5">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={index}>
                <td className="text-capitalize">{book.studentName}</td>
                <td className="text-capitalize">{book.bookName}</td>
                <td>
                  <button
                    className="btn mx-2 btn-success"
                    onClick={() => handleAccept(book)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn mx-2 btn-danger"
                    onClick={() => handleReject(book)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
