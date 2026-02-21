import React, { useState } from "react";
import axios from "axios"; // npm install axios

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      console.log(res.data);
      setMessage("User registered successfully!");
      setForm({ name: "", password: "", role: "student" });
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="worker">Worker</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default Register;
