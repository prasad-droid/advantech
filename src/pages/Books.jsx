import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase_config";
import { doc, getDoc } from "firebase/firestore";

export default function Book() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
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
      let data = docSnap.data()["students"];
      let user = data.filter((u) => {
        if (u.id == id) {
          return u;
        }
      });
      console.log(user);
      let books = user[0]["books"];
      console.log(books);
      setBooks(books);
    }
  };

  const handleApply = () => {
    let cs = prompt("Does Your Course Started ?");
    console.log(cs);
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
                      data-bs-toggle="modal" data-bs-target="#myModal"
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
                onClick={() => handleApply(1)}
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
