import { getDoc, addDoc, doc, documentId, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase_config";
import { v4 as uuidv4 } from "uuid";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);

  // insert User
  const handleAddUser = async () => {
    console.log("started");
    let docRef = doc(db, "users", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let userData = {
          id: uuidv4(),
          username: username,
          password: password,
          email: email,
          course: course,
        };
        const prevData = docSnap.data()["students"];
        await setDoc(docRef, { students: [...prevData, userData] });
        console.log("done");
        hideModal();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // clearFields
  const clearFields = () => {
    setUsername("");
    setPassword("");
    setCourse("");
    setPassword("");
  };

  // hide modal
  const hideModal = () => {
    clearFields();
    let clsBtn = document.querySelector("[data-bs-dismiss]");
    clsBtn.click();
  };

  // show users
  const fetchData = async () => {
    let docRef = doc(db, "users", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsers(docSnap.data()["students"]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [users]);

  // alter users
  const AlterUser = (id) => {
    console.log(id);
  };

  const deleteUser = (id) => {
    console.log(id);
  };
  return (
    <>
      <div className="admin-page">
        <h1>Admin Page</h1>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
        >
          Add User
        </button>

        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Functions</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    className="btn mx-2 btn-warning"
                    onClick={() => {
                      AlterUser(user.id);
                    }}
                  >
                    Alter
                  </button>
                  <button
                    className="btn mx-2 btn-danger"
                    onClick={() => {
                      deleteUser(user.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
                {/* Add more columns as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add User</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control my-2"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
              <select
                type="text"
                className="form-select my-2"
                placeholder="Course"
                onChange={(e) => {
                  setCourse(e.target.value);
                }}
              >
                <option value="" hidden={true}>
                  Course
                </option>
                <option value="msOffice">MS OFFICE</option>
                <option value="mscit">MS CIT</option>
                <option value="dca">DCA</option>
                <option value="cca">CCA</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleAddUser();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
