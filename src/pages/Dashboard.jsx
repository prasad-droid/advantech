import React from 'react';

const Dashboard = () => {
  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Student Management System Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Books</h2>
              <p className="card-text">Manage library books and borrow/return records.</p>
              <a href="/books" className="btn btn-primary">View Books</a>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Exams</h2>
              <p className="card-text">Schedule exams, record grades, and track student performance.</p>
              <a href="/exams" className="btn btn-primary">View Exams</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Fees</h2>
              <p className="card-text">Manage student fees, payment records, and outstanding balances.</p>
              <a href="/fees" className="btn btn-primary">View Fees</a>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Results</h2>
              <p className="card-text">Record and view student exam results and grades.</p>
              <a href="/results" className="btn btn-primary">View Results</a>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Attendance</h2>
              <p className="card-text">Track student attendance records and generate reports.</p>
              <a href="/attendance" className="btn btn-primary">View Attendance</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
