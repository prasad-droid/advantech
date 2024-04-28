import { useState } from "react";
import { auth, db } from "../firebase_config";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [msg, setMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async () => {
    let docRef = doc(db, "admins", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        for (let i = 0; i < docSnap.data().admins.length; i++) {
          const admin = docSnap.data().admins[i];
          if (admin.uname == Username && admin.pwd == Password) {
            navigate('/admindashboard');
            break;
          } else {
            setMessage("Incorrect Credentials");
          }
        }
      }
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center hv-100">
      <div className="form d-flex flex-column justify-content-center align-items-center text-bg-dark px-4 py-5 rounded-3">
        <h4>Admin Login</h4>
        <input
          type="text"
          className="form-control my-2"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          className="form-control my-2"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="button"
          value="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        />
        <span className="text-danger">{msg}</span>
      </div>
    </div>
  );
}
