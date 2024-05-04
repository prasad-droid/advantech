import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function ManageBooks(){
    const navigate = useNavigate();
    // check user
    const checkUser = function () {
      // console.log(localStorage);
      if (!localStorage.hasOwnProperty("admin")) {
          navigate("/admin");
      }
    };
    useEffect(()=>{
        checkUser();
    })
    return (
        <h1>Manage User</h1>
    )
}