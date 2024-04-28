import { signInWithEmailAndPassword, signInWithEmailLink } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase_config";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  
  function clearFields() {
    setEmail("");
    setPassword("");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      clearFields();
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container hv-100 d-flex justify-content-center align-items-center">
      <div className="form w-50 mx-auto d-flex flex-column align-items-center">
        <h3>Advantech Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control my-2 w-50"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control my-2 w-50"
        />
        <a href="/signup">Not a User ?</a>
        <button onClick={(e) => handleSubmit(e)} className="btn btn-primary">
          Sign In
        </button>
        <span className="text-danger">{message}</span>
      </div>
    </div>
  );
}
