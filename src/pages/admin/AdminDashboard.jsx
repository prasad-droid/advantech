import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  // check user
  const checkUser = function () {
    // console.log(localStorage);
    if (!localStorage.hasOwnProperty("admin")) {
        navigate("/admin");
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
          onClick={()=>{navigate('/manageUsers')}}
        >
          <i className="fa-solid fa-user mx-2"></i>
          Manage User
        </button>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={()=>{navigate('/manageBooks')}}
        >
          <i className="fa-solid fa-book mx-2"></i>
          Manage Books
        </button>
        
        
      </div>
    </>
  );
}
