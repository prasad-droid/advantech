import { useState } from "react";
import { db } from "../../firebase_config";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [msg, setMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let docRef = doc(db, "admins", "advantech");
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log();
        let data = docSnap.data()["admins"];
        let user = data.filter((u) => {
          if (u.uname === Username && u.pwd === Password) {
            console.log(u);
            return u
          }
        });
        if(user.length != 0){
          alert("Welcome "+user[0].username)
          localStorage.setItem('admin',JSON.stringify(user[0]))
          navigate('/admindashboard')
        }else{
          setMessage("Invalid Credentials")
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
          onClick={(e)=>{handleSubmit(e)}}
        />
        <span className="text-danger">{msg}</span>
      </div>
    </div>
  );
}
