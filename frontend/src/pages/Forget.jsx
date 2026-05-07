import React, { useState } from "react";
const ForgetPasswordPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.newPassword !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  const res = await fetch("https://campus-market.fly.dev/api/auth/forgetPassword", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.email,
      name: formData.username,
      newPassword: formData.newPassword
    }),
  }).then((r) => r.json());

  if (res.message === "Password reset successful") {
    alert("Password updated! Please login.");
    onBack(); 
  } else {
    alert(res.message || "Something went wrong");
  }
};

  const cssStyles = `
    .main-wrapper {
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:100vh;
      background:#081b29;
      font-family:Poppins,sans-serif;
      color:#fff;
    }

    .container {
      width:450px;
      padding:40px;
      border:2px solid #00abf0;
      box-shadow:0 0 25px #00abf0;
      border-radius:15px;
    }

    .form-box h1{
      font-size:32px;
      text-align:center;
      margin-bottom:20px;
    }

    .input-box{
      position:relative;
      width:100%;
      height:50px;
      margin:20px 0;
    }

    .input-box input{
      width:85%;
      height:100%;
      background:transparent;
      border:2px solid rgba(255,255,255,.2);
      border-radius:40px;
      outline:none;
      font-size:16px;
      color:#fff;
      padding:0 45px 0 20px;
      transition:0.3s;
    }

    .input-box input:focus{
      border-color:#00abf0;
    }

    .input-box i{
      position:absolute;
      right:20px;
      top:50%;
      transform:translateY(-50%);
      font-size:20px;
    }

    .btn{
      width:100%;
      height:45px;
      background:#00abf0;
      border:none;
      border-radius:40px;
      cursor:pointer;
      font-size:16px;
      color:#fff;
      font-weight:600;
    }

    .btn:hover{
      background:#0081b5;
    }

    .back-link{
      text-align:center;
      margin-top:20px;
    }

    .back-link a{
      color:#fff;
      text-decoration:none;
      font-size:14px;
    }
  `;

  return (
    <div className="main-wrapper">

      <style>{cssStyles}</style>

      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />

      <div className="container">

        <div className="form-box">

          <form onSubmit={handleSubmit}>

            <h1>Forget Password</h1>

            <div className="input-box">
              <input
                name="username"
                type="text"
                placeholder="Username"
                required
                onChange={handleChange}
              />
              <i className="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                onChange={handleChange}
              />
              <i className="bx bxs-envelope"></i>
            </div>

            <div className="input-box">
              <input
                name="newPassword"
                type="password"
                placeholder="New Password"
                required
                onChange={handleChange}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="input-box">
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
              />
              <i className="bx bxs-check-shield"></i>
            </div>

            <button type="submit" className="btn">
              Update Password
            </button>

            <div className="back-link">
            <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Back to Login</a>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ForgetPasswordPage;