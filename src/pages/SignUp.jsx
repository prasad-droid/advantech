import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase_config";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const addToDatabase = async () => {
    const docRef = doc(db, "users", email);
    
    try {
      let details = {
        firstName: uname,
        email: email,
        course: null,
      };
      await setDoc(doc(collection(db, "users"), email), {
        details: [details],
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let user = await createUserWithEmailAndPassword(auth, email, password);
      let dbconnect = await addToDatabase();
      console.log(user,dbconnect);
      setEmail("");
      setUname("");
      setPassword("");
      setMessage("User Created");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container hv-100 d-flex justify-content-center align-items-center">
      <div className="form w-50 mx-auto d-flex flex-column align-items-center">
        <h3>Advantech SignUp</h3>
        <input
          type="text"
          placeholder="Username"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          className="form-control my-2 w-50"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control my-2 w-50"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control my-2 w-50"
          required
        />
        <a href="/login">Already a user ?</a>

        <button onClick={(e) => handleSubmit(e)} className="btn btn-primary">
          Register
        </button>
        <span className="text-danger">{message}</span>
      </div>
    </div>
  );
}
