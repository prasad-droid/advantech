import { useEffect } from "react";

export default function Home() {
  const handleUser = () => {
    if (!localStorage.hasOwnProperty("user")) {
      localStorage.setItem("user", "[]");
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <>
      <div className="container">
        <header className="p-5 text-bg-primary rounded my-2">
          <h1>Welcome to Computer Classes</h1>
          <p>
            Start your journey to becoming a computer whiz with our expert-led
            classes.
          </p>
          <a href="/login" className="btn btn-warning">
            Login
          </a>
        </header>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h2 className="card-title">Programming Fundamentals</h2>
                <p className="card-text">
                  Learn the basics of programming with our beginner-friendly
                  courses.
                </p>
                <a href="/programming" className="btn btn-primary ">
                  Explore Courses
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h2 className="card-title">Web Development</h2>
                <p className="card-text">
                  Master the art of building websites and web applications from
                  scratch.
                </p>
                <a href="/web-development" className="btn btn-primary ">
                  Explore Courses
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h2 className="card-title">Data Science</h2>
                <p className="card-text">
                  Dive into the world of data analytics and machine learning.
                </p>
                <a href="/data-science" className="btn btn-primary ">
                  Explore Courses
                </a>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-5 text-center">
          <p>&copy; 2024 Computer Classes</p>
        </footer>
      </div>
    </>
  );
}
