import React, { useState } from "react";

const Reset = ({ user, onBack }) => {
  const [pass, setPass] = useState({ new: "", confirm: "" });

const handleReset = async (e) => {
  e.preventDefault();
  if (pass.new !== pass.confirm) {
    alert("Passwords do not match!");
    return;
  }
  
  const res = await fetch("https://campus-market.fly.dev/api/auth/resetPassword", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, newPassword: pass.new }),
  }).then((r) => r.json());

  if (res.message === "Password reset successful") {
    alert("Password Reset Successfully!");
    onBack(); 
  } else {
    alert(res.message || "Something went wrong");
  }
};

  const cssStyles = `
    .main-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #081b29; font-family: 'Poppins', sans-serif; color: #fff; }
    .container { width: 450px; padding: 40px; border: 2px solid #00abf0; box-shadow: 0 0 25px #00abf0; border-radius: 15px; background: transparent; }
    .form-box h1 { font-size: 32px; text-align: center; margin-bottom: 10px; }
    .subtitle { text-align: center; font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 20px; }
    .input-box { position: relative; width: 100%; height: 50px; margin: 20px 0; }
    .input-box input { width: 85%; height: 100%; background: transparent; border: 2px solid rgba(255, 255, 255, .2); border-radius: 40px; outline: none; font-size: 16px; color: #fff; padding: 0 45px 0 20px; }
    .input-box input:focus { border-color: #00abf0; }
    .input-box i { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 20px; }
    .btn { width: 100%; height: 45px; background: #00abf0; border: none; border-radius: 40px; cursor: pointer; font-size: 16px; color: #fff; font-weight: 600; transition: 0.3s; }
    .btn:hover { background: #0081b5; box-shadow: 0 0 15px #00abf0; }
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
          <form onSubmit={handleReset}>
            <h1>Reset Password</h1>
            <p className="subtitle">Please enter your new password</p>
            <div className="input-box">
              <input
                type="password"
                placeholder="New Password"
                required
                onChange={(e) => setPass({ ...pass, new: e.target.value })}
              />
              <i className="bx bxs-lock-open-alt"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                onChange={(e) => setPass({ ...pass, confirm: e.target.value })}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="btn">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
