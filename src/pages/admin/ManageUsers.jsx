import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const navigate = useNavigate();
  // check user
  const checkUser = function () {
    // console.log(localStorage);
    if (!localStorage.hasOwnProperty("admin")) {
      navigate("/admin");
    }
  };

  const [username, setAddUsername] = useState("");
  const [email, setAddEmail] = useState("");
  const [course, setAddCourse] = useState("");
  const [password, setAddPassword] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // State variables for Alter User modal
  const [alterUsername, setAlterUsername] = useState("");
  const [alterEmail, setAlterEmail] = useState("");
  const [alterCourse, setAlterCourse] = useState("");
  const [alterPassword, setAlterPassword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    checkUser();
  }, [localStorage]);
  useEffect(() => {
    fetchData();
  }, [users]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCourses([...selectedCourses, value]);
      setSelectedBooks([
        ...selectedBooks,
        { name: value, status: false, reason: "Course not Started" },
      ]);
    } else {
      setSelectedBooks(selectedBooks.filter((books) => books !== value));
      setSelectedCourses(selectedCourses.filter((course) => course !== value));
    }
  };

  // formValidation
  const validateUserForm = (username, password, email, selectedCourses) => {
    // Check if any field is empty
    if (!username || !password || !email || !selectedCourses) {
      alert("Please fill out all fields.");
      return false;
    }

    // Password strength validation (minimum 8 characters)
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return false;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // All validations passed
    return true;
  };

  // insert User
  const handleAddUser = async () => {
    if (!validateUserForm(username, password, email, selectedCourses)) {
      return;
    }
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
          course: selectedCourses,
          books: selectedBooks,
        };
        const prevData = docSnap.data()["users"];
        await setDoc(docRef, { students: [...prevData, userData] });
        console.log("done");
        hideModal("myModal");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // clearFields
  const clearFields = () => {
    setAddUsername("");
    setAddPassword("");
    setAddCourse("");
    setAddPassword("");
    setAddEmail("");
  };

  // toggle modal
  const hideModal = (modalId) => {
    if (modalId == "myModal") {
      document.getElementById("addCloseBtn").click();
    } else {
      document.getElementById("alterCloseBtn").click();
    }
  };

  // show users
  const fetchData = async () => {
    let docRef = doc(db, "users", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsers(docSnap.data()["users"]);
        // console.log(users);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // alter users
  const AlterUser = (id) => {
    clearFields();
    setSelectedUserId(id);
    const user = users.find((user) => user.id === id);
    if (user) {
      console.log(user);
      setAlterUsername(user.username);
      setAlterEmail(user.email);
      setAlterPassword(user.password);
      setAlterCourse(user.course);
    }
  };

  // alterUser details
  const handleAlterUser = async () => {
    try {
      if (
        !validateUserForm(alterUsername, alterPassword, alterEmail, alterCourse)
      ) {
        return;
      }
      const docRef = doc(db, "users", "advantech");
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUserId) {
          return {
            ...user,
            username: alterUsername,
            email: alterEmail,
            password: alterPassword,
            course: alterCourse,
          };
        }
        return user;
      });

      await updateDoc(docRef, { students: updatedUsers });
      hideModal("myModal1");
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const docRef = doc(db, "users", "advantech");
    console.log(id);
    const updatedUsers = users.filter((user) => user.id !== id);
    try {
      await updateDoc(docRef, { students: updatedUsers });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="admin-page">
        <div className="nav d-flex justify-content-between align-items-center">
          <span className="h1">Admin Page</span>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("admin");
              navigate("/admin");
            }}
          >
            Log Out
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary m-2"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
        >
          Add User
        </button>
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Functions</th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>
                    <button
                      className="btn mx-2 btn-warning"
                      data-bs-target="#myModal1"
                      data-bs-toggle="modal"
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
              ))
            ) : (
              <tr>
                <td colspan="3">No records</td>
              </tr>
            )}
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
                id="addCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control my-2"
                placeholder="Username"
                onChange={(e) => {
                  setAddUsername(e.target.value);
                }}
                value={username ? username : ""}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Password"
                onChange={(e) => {
                  setAddPassword(e.target.value);
                }}
                value={password}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Email"
                onChange={(e) => {
                  setAddEmail(e.target.value);
                }}
                value={email}
              />
              <input
                className="form-check-input mx-2"
                type="checkbox"
                value="msOffice"
                onChange={handleCheckboxChange}
              />
              MS OFFICE
              <input
                className="form-check-input mx-2"
                type="checkbox"
                value="mscit"
                onChange={handleCheckboxChange}
              />
              MS CIT
              <input
                className="form-check-input mx-2"
                type="checkbox"
                value="dca"
                onChange={handleCheckboxChange}
              />
              DCA
              <input
                className="form-check-input mx-2"
                type="checkbox"
                value="cca"
                onChange={handleCheckboxChange}
              />
              CCA
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

      {/* alter Modal */}
      <div className="modal" id="myModal1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Alter User</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="alterCloseBtn"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control my-2"
                placeholder="Username"
                onChange={(e) => {
                  setAlterUsername(e.target.value);
                }}
                value={alterUsername}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Password"
                onChange={(e) => {
                  setAlterPassword(e.target.value);
                }}
                value={alterPassword}
              />
              <input
                type="text"
                className="form-control my-2"
                placeholder="Email"
                onChange={(e) => {
                  setAlterEmail(e.target.value);
                }}
                value={alterEmail}
              />

              <input
                type="text"
                className="form-control my-2"
                placeholder="Course"
                value={alterCourse}
                onChange={(e) => {
                  setAlterCourse(e.target.value);
                }}
              />
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
                  handleAlterUser();
                }}
              >
                Modify
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
