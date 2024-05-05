import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase_config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Book() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState("");
  const [bookName, setBookName] = useState("");

  const checkUser = function () {
    // console.log(localStorage);
    if (localStorage.hasOwnProperty("user")) {
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    checkUser();
    getBookDetail();
  }, []);

  const getBookDetail = async () => {
    let id = JSON.parse(localStorage.getItem("user"))["id"];
    let docRef = doc(db, "users", "advantech");
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data()["users"];
      let user = data.filter((u) => {
        if (u.id == id) {
          return u;
        }
      });
      setUser(user[0]);
      setBooks(user[0]["books"]);
    }
  };

  const handleApply = async (n, u) => {
    if (n && u && bookName) {
      try {
        let docRef = doc(db, "books", "advantech");
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prevData = docSnap.data().books || []; // Ensure prevData is an array
          if (
            prevData.some(
              (book) => book.bookName === bookName && book.studId === u.id
            )
          ) {
            alert("You have already applied for this book.");
            return;
          } else {
            let newBook = {
              bookName: bookName,
              studId: u.id,
              studentName: u.username,
            };
            await setDoc(
              docRef,
              { books: [...prevData, newBook] },
              { merge: true }
            );
            alert("Book applied successfully.");
          }
        } else {
          alert("Document does not exist.");
        }
      } catch (error) {
        console.error("Error applying book:", error);
      }
    } else {
      alert("Invalid parameters for applying book.");
    }
  };

  return (
    <>
      <h1 className="text-center">Books</h1>
      <table className="table w-50 mx-auto table-dark table-striped">
        <thead>
          <tr>
            <th>Book</th>
            <th>Status</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
          {books
            ? books.map((book, index) => (
                <tr key={index}>
                  <td>{book.name.toUpperCase()}</td>
                  <td>
                    {book.status ? "Book Given" : `Pending ( ${book.reason} )`}
                  </td>
                  <td>
                    <button
                      className={
                        book.status
                          ? "btn btn-secondary disabled"
                          : `btn btn-warning`
                      }
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                      onClick={() => {
                        setBookName(book.name);
                        console.log(bookName);
                      }}
                    >
                      {book.status ? "Applied" : "Apply"}
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply for Book</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Does Your Course Started ..</div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => handleApply(1, user)}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => handleApply(0)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
