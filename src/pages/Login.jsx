import { useState } from "react";
import "../App.css";
import { db } from "../firebase_config";
import { doc, getDoc } from "firebase/firestore";
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
      let docRef = doc(db, "users", "advantech");
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log();
        let data = docSnap.data()["users"];
        let user = data.filter((u) => {
          if (u.email === email && u.password === password) {
            console.log(u);
            return u
          }
        });
        if(user.length != 0){
          alert("Welcome "+user[0].username)
          localStorage.setItem('user',JSON.stringify(user[0]))
          navigate('/dashboard')
        }else{
          setMessage("Invalid Credentials")
        }
      }
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
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control my-2 w-50"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control my-2 w-50"
        />
        {/* <a href="/signup">Not a User ?</a> */}
        <button onClick={(e) => handleSubmit(e)} className="btn btn-primary">
          Sign In
        </button>
        <span className="text-danger">{message}</span>
      </div>
    </div>
  );
}
