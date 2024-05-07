// Import the necessary functions from Firebase
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";

export default function ManageExams() {
  const navigate = useNavigate();
  const [Exams, setExams] = useState([]);

  // Check if the user is an admin
  const checkUser = function () {
    if (!localStorage.hasOwnProperty("admin")) {
      navigate("/admin");
    }
  };

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  // Fetch book data from Firestore
  const fetchData = async () => {
    let docRef = doc(db, "Exams", "advantech");
    try {
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setExams(docSnap.data()["exams"]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Accept a book request
  const handleAccept = async (user) => {
    try {
      // Step 1: Get the student ID from the book object
      const studentId = user.studId;

      // Step 2: Create a reference to the Firestore document containing users' data
      const studentDocRef = doc(db, "users", "advantech");

      // Step 3: Retrieve the student document snapshot
      const studentDocSnap = await getDoc(studentDocRef);

      // Step 4: Check if the document exists
      if (studentDocSnap.exists()) {
        // Step 5: Update the book status in the user's data
        const userData = studentDocSnap.data()["users"];
        const updatedExams = userData.map((user) => {
          // Iterate over users' data
          if (user.id === studentId) {
            // If user's ID matches the student ID
            const updatedUserExams = user.Exams.map((userBook) => {
              // Iterate over the user's Exams
              if (userBook.name === user.bookName) {
                // If book name matches the accepted book's name
                return { ...userBook, status: true }; // Update the book status to true (given)
              }
              return userBook;
            });
            return { ...user, Exams: updatedUserExams }; // Update user's Exams array
          }
          return user;
        });

        // Step 6: Update the user document in Firestore
        await setDoc(doc(db, "users", "advantech"), { users: updatedExams });

        // Step 7: Remove the book from the collection
        const updatedExamsList = Exams.filter((b) => b !== user);
        await setDoc(doc(db, "exams", "advantech"), {
          Exams: updatedExamsList,
        });

        // Step 8: Logging
        console.log("Book accepted and status updated.");
      }
    } catch (error) {
      // Step 9: Error handling
      console.error("Error accepting book:", error);
    }
  };

  // Reject a book request
  const handleReject = async (book) => {
    try {
      // Delete the book data from Firestore
      const updatedExamsList = Exams.filter(
        (b) => b.bookName !== book.bookName
      );
      await setDoc(doc(db, "Exams", "advantech"), { exams: updatedExamsList });

      console.log("Book rejected and removed from collection.");
    } catch (error) {
      console.error("Error rejecting book:", error);
    }
  };

  return (
    <>
      <h1 className="text-center">Manage Exams</h1>
      <table className="table table-dark table-striped table-hover w-50 mx-auto mt-5">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exam Name</th>
            <th>Exam Month</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Exams.length > 0 ? (
            Exams.map((exam, index) => (
              <tr key={index}>
                <td className="text-capitalize">{exam.studentName}</td>
                <td className="text-capitalize">{exam.examName}</td>
                <td className="text-capitalize">{exam.examMonth}</td>
                <td>
                  <button
                    className="btn mx-2 btn-success"
                    onClick={() => handleAccept(exam)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn mx-2 btn-danger"
                    onClick={() => handleReject(exam)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
