import { useState } from "react";
import { authAPI } from "../api";
import Forget from "./Forget";

const cssStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  .main-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #081b29;
  }

  .container {
    position: relative;
    width: 850px;
    height: 550px;
    background: transparent;
    border: 2px solid #00abf0;
    box-shadow: 0 0 25px #00abf0;
    overflow: hidden;
    border-radius: 15px;
  }

  .form-box {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 40px;
    transition: .6s ease-in-out;
    color: #fff;
    z-index: 1;
  }

  .form-box.login { left: 0; }
  .container.active .form-box.login { left: -50%; }
  .form-box.register { right: -50%; }
  .container.active .form-box.register { right: 0; }

  .form-box h1 {
    font-size: 32px;
    text-align: center;
    margin-bottom: 20px;
  }

  .input-box, .select-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 15px 0;
  }

  .input-box input,
  .select-box select {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .2);
    border-radius: 40px;
    outline: none;
    font-size: 16px;
    color: #fff;
    padding: 0 45px 0 20px;
    transition: 0.3s;
  }

  .input-box input:focus,
  .select-box select:focus {
    border-color: #00abf0;
  }

  .input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
  }

  .select-box select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .select-box::after {
    content: '\\eb60';
    font-family: 'boxicons';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    pointer-events: none;
    color: #fff;
  }

  .select-box select option {
    background: #081b29;
    color: #fff;
  }

  .btn {
    width: 100%;
    height: 45px;
    background: #00abf0;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    transition: 0.3s;
    margin-top: 10px;
  }

  .btn:hover {
    background: #0081b5;
    box-shadow: 0 0 15px #00abf0;
  }

  .toggle-box {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    background: #00abf0;
    transition: .6s ease-in-out;
    border-radius: 150px 0 0 150px;
    z-index: 10;
  }

  .container.active .toggle-box {
    left: 0;
    border-radius: 0 150px 150px 0;
  }

  .toggle-panel {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    transition: .6s ease-in-out;
  }

  .toggle-left { left: 0; transform: translateX(0); }
  .container.active .toggle-left { transform: translateX(-100%); }
  .toggle-right { right: -100%; }
  .container.active .toggle-right { right: 0; }

  .toggle-panel h1 { font-size: 30px; margin-bottom: 10px; }
  .toggle-panel p { font-size: 14px; }

  .toggle-panel button {
    background: transparent;
    border: 2px solid #fff;
    margin-top: 20px;
    width: 150px;
    height: 45px;
    border-radius: 40px;
    cursor: pointer;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    transition: 0.3s;
  }

  .toggle-panel button:hover {
    background: #fff;
    color: #00abf0;
  }
`;

// ✅ setShowForget بتيجي من AuthForm مش من جوا LoginForm
function LoginForm({ onLogin, setShowForget }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await authAPI.login({ email, password });
    setLoading(false);
    if (res.user) {
      onLogin(res.user);
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="form-box login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p style={{ color: "red", fontSize: 13, textAlign: "center" }}>{error}</p>}
        <div className="input-box">
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <i className="bx bxs-envelope"></i>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          <i className="bx bxs-lock-alt"></i>
        </div>
        <div style={{ textAlign: "right", margin: "-10px 0 15px" }}>
          <a
            href="#"
            style={{ color: "#fff", fontSize: 14 }}
            onClick={(e) => { e.preventDefault(); setShowForget(true); }}
          >
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await authAPI.register({ name, email, password, role });
    setLoading(false);
    if (res._id) {
      setSuccess("Registered successfully! Please login.");
    } else {
      setError(res.message || "Register failed");
    }
  };

  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && <p style={{ color: "red", fontSize: 13, textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen", fontSize: 13, textAlign: "center" }}>{success}</p>}
        <div className="input-box">
          <input type="text" placeholder="Username" required onChange={(e) => setName(e.target.value)} />
          <i className="bx bxs-user"></i>
        </div>
        <div className="input-box">
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <i className="bx bxs-envelope"></i>
        </div>
        <div className="select-box">
          <select required onChange={(e) => setRole(e.target.value)} defaultValue="">
            <option value="" disabled hidden>Select One</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="worker">Worker</option>
          </select>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          <i className="bx bxs-lock-alt"></i>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}

// ✅ showForget و setShowForget هنا في AuthForm
export default function AuthForm({ onLogin }) {
  const [isActive, setIsActive] = useState(false);
  const [showForget, setShowForget] = useState(false);

  // ✅ لو showForget = true ورّي صفحة Forget بدل Login/Register
  if (showForget) {
    return <Forget onBack={() => setShowForget(false)} />;
  }

  return (
    <div className="main-wrapper">
      <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      <style>{cssStyles}</style>
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* ✅ بنمرر setShowForget لـ LoginForm عشان لما يضغط Forgot Password يغيرها */}
        <LoginForm onLogin={onLogin} setShowForget={setShowForget} />
        <RegisterForm />
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button onClick={() => setIsActive(true)}>Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button onClick={() => setIsActive(false)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
