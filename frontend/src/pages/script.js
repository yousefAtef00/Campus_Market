const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

const BASE_URL = "http://localhost:5000/api/auth";

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


// REGISTER 
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const name = document.getElementById("register-name").value;
    const role = document.getElementById("register-role").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
  if(password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }
    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email,role, password })
        });
        const data = await res.json();

       if(data.email && data.name && data.role) {
    alert(`User Registered: ${data.name} (${data.role})`);
            registerForm.reset();
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
});



// LOGIN 

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
   const password = document.getElementById("loginPassword").value;
if(email=='admin@gmail.com' && password=='admin000') {
    window.location.href = "admin.html";
    return;
}
else {
    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        
        });
        const data = await res.json();
        alert(data.message);
        if (res.ok) {
              if (email === "admin@gmail.com" && password === "admin000") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "Dashboard.html";
            
            localStorage.setItem("user", JSON.stringify(
                { email: data.user?.email || data.email,
        name: data.user?.name || data.name,
        role: data.user?.role || data.role
    }
            ));

    window.location.href = "Dashboard.html";}

        }

    } catch (error) {
           console.log("Full Error:", error);
        alert("Login Error");
        console.log(error);
    }}
});
