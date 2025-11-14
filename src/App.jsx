import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [editEmployee, setEditEmployee] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', salary: '', id: '' });

  // 🔐 Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showValidation, setShowValidation] = useState(false); // added

  // ✅ Fetch all employees (only when logged in)
  useEffect(() => {
    if (isLoggedIn) fetchEmployees();
  }, [isLoggedIn]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8089/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // ✅ Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setShowValidation(true); // show validation messages when login clicked

    const { username, password } = loginForm;

    // If either field is empty, stop login attempt
    if (!username || !password) {
      return;
    }

    // Example credentials (replace later with backend validation)
    if (
      (username === 'admin' && password === '12345') ||
      (username === 'hemanth' && password === '9493')
    ) {
      setIsLoggedIn(true);
      setShowValidation(false);
    } else {
      alert('Invalid credentials! Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setShowValidation(false);
  };

  // ✅ Search employee
  const handleSearch = async () => {
    if (!search.trim()) {
      fetchEmployees();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8089/employees/search?query=${search}`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // ✅ Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8089/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // ✅ Edit employee
  const handleEdit = (emp) => {
    setEditEmployee(emp.id);
    setForm({ name: emp.name, role: emp.role, salary: emp.salary, id: emp.id });
  };

  // ✅ Update employee
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8089/employees/${editEmployee}`, form);
      setEditEmployee(null);
      setForm({ name: '', role: '', salary: '', id: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // ✅ Create employee
  const handleCreate = async () => {
    if (!form.name || !form.role || !form.salary) {
      alert('Please fill all fields!');
      return;
    }
    try {
      await axios.post('http://localhost:8089/employees', form);
      setForm({ name: '', role: '', salary: '', id: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  // -------------------------------------------------------------
  // 🔐 LOGIN SCREEN (Before Login)
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    const { username, password } = loginForm;
    const isUserMissing = showValidation && !username;
    const isPasswordMissing = showValidation && !password;

    return (
      
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
         <h1> <div className="emoji-box">
  <span className="wave">👋</span>
  <h3 className="emoji-text">Hello! Please Login</h3></div></h1>
      
        
        
        <div className="card p-4 shadow">
          
          <h3 className="text-center mb-4"></h3>
          <form onSubmit={handleLogin}>
         <h3 className="emoji-text">  <div><pre>Username:"admin"
                      password:"12345"</pre></div></h3>
            <input
              type="text"
              className={`form-control mb-3 ${isUserMissing ? 'border-danger shadow-sm' : ''}`}
              placeholder="Username"
              value={username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            {/* {isUserMissing && <small className="text-danger">Please enter username</small>} */}

            <input
              type="password"
              className={`form-control mb-3 ${isPasswordMissing ? 'border-danger shadow-sm' : ''}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            {/* {isPasswordMissing && <small className="text-danger">Please enter password</small>} */}
<br></br>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 🧭 EMPLOYEE MANAGEMENT SYSTEM (After Login)
  // -------------------------------------------------------------
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employee Management System</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="d-flex mb-4 justify-content-center">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Search by Name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary ms-2" onClick={fetchEmployees}>
          Reset
        </button>
      </div>

      {/* ➕ Create or Edit Employee */}
      {!editEmployee ? (
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Add New Employee</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleCreate}>
            Add Employee
          </button>
        </div>
      ) : (
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Edit Employee</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
          <button className="btn btn-success me-2" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setEditEmployee(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* 📋 Employee Table */}
      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td>₹{emp.salary}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
