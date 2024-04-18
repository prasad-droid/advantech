import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp'
import Login from './pages/Login'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
