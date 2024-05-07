import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase_config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState("");
  const [examName, setExamName] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completionDate, setCompletionDate] = useState("");
  const [examMonth, setExamMonth] = useState("");

  const currentDate = new Date();

  // Get next three months
  const getNextThreeMonths = () => {
    const nextThreeMonths = [];
    for (let i = 0; i < 3; i++) {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(currentDate.getMonth() + i + 1);
      nextThreeMonths.push(
        nextMonth.toLocaleString("default", { month: "long" })
      );
    }
    return nextThreeMonths;
  };

  const handleCompletionChange = (event) => {
    setCompleted(event.target.value === "true");
  };

  const handleExamMonthChange = (event) => {
    setExamMonth(event.target.value);
  };

  const checkUser = function () {
    // console.log(localStorage);
    if (localStorage.hasOwnProperty("user")) {
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    checkUser();
    getBookDetail();
  }, []);

  const getBookDetail = async () => {
    let id = JSON.parse(localStorage.getItem("user"))["id"];
    let docRef = doc(db, "users", "advantech");
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data()["users"];
      let user = data.filter((u) => {
        if (u.id == id) {
          return u;
        }
      });
      setUser(user[0]);
      setExams(user[0]["exams"]);
    }
  };

  const handleApply = async (n, u) => {
    if (!completed) {
      alert("Please indicate if the course is completed.");
      return;
    } else if (!completionDate) {
      alert("Please select the date of completion.");
      return;
    } else if (!examMonth) {
      alert("Please select the month for examination.");
      return;
    }
    if (n && u && examName) {
      try {
        let docRef = doc(db, "Exams", "advantech");
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prevData = docSnap.data().exams || []; // Ensure prevData is an array
          if (
            prevData.some(
              (book) => book.examName === examName && book.studId === u.id
            )
          ) {
            alert("You have already applied for this book.");
            return;
          } else {
            let newBook = {
              examName: examName,
              studId: u.id,
              studentName: u.username,
              examMonth: examMonth,
              DOC: completionDate,
            };
            await setDoc(
              docRef,
              { exams: [...prevData, newBook] },
              { merge: true }
            );
            alert("Applied for Exam successfully.");
          }
        } else {
          alert("Document does not exist.");
        }
      } catch (error) {
        console.error("Error applying exam:", error);
      }
    } else {
      alert("Invalid parameters for applying exam.");
    }
  };

  return (
    <>
      <h1 className="text-center">Exams</h1>
      <table className="table w-50 mx-auto table-dark table-striped">
        <thead>
          <tr>
            <th>Exam Subject</th>
            <th>Status</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
          {exams ? (
            exams.map((exam, index) => (
              <tr key={index}>
                <td>{exam.name.toUpperCase()}</td>
                <td>
                  {exam.status ? "Exam Given" : `Pending ( ${exam.reason} )`}
                </td>
                <td>
                  <button
                    className={
                      exam.status
                        ? "btn btn-secondary disabled"
                        : `btn btn-warning`
                    }
                    data-bs-toggle="modal"
                    data-bs-target="#myModal"
                    onClick={() => {
                      setExamName(exam.name);
                      console.log(examName);
                    }}
                  >
                    {exam.status ? "Applied" : "Apply"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply for Exam</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p>Course Completed ? </p>
              <input
                type="radio"
                className="m-2"
                name="status"
                value={true}
                onChange={handleCompletionChange}
              />
              Yes
              <input
                type="radio"
                className="m-2"
                name="status"
                value={false}
                onChange={handleCompletionChange}
              />
              No
              <p>Date of Completion</p>
              <input
                type="date"
                name="completionDate"
                className="form-control d-inline"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                disabled={!completed}
              />
              <p>Month for Examination</p>
              {getNextThreeMonths().map((month, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    className="m-2"
                    name="examMonth"
                    value={month}
                    onChange={handleExamMonthChange}
                    disabled={!completed}
                  />
                  <label>{month}</label>
                </div>
              ))}
              <span className="text-warning small align-start">
                Note : Exams will be conducted between 25-30 of selected Month
              </span>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => handleApply(1, user)}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => handleApply(0)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
