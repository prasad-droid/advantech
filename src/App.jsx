import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Books from './pages/Books'
import Exams from './pages/Exams'
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageExams from "./pages/admin/ManageExams";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          {/* User */}
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="exams" element={< Exams/>} />
          {/* Admin */}
          <Route path="admin" element={<Admin />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="manageBooks" element={<ManageBooks />} />
          <Route path="manageUsers" element={<ManageUsers />} />
          <Route path="manageExams" element={<ManageExams />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
