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


// ================= REGISTER =================

// Register
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const name = document.getElementById("register-name").value;
    const role = document.getElementById("register-role").value;
    const password = document.getElementById("register-password").value;

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, role, password })
        });
        const data = await res.json();

        if(data.user) {
            alert(`User Registered: ${data.user.name} (${data.user.role})`);
            registerForm.reset();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
});



// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("loginName").value;
   const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, password })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            console.log(data.user);

            // تقدر تروح صفحة حسب الدور هنا
            if (data.user.role === "student") {
                window.location.href = "student.html";
            } else if (data.user.role === "teacher") {
                window.location.href = "teacher.html";
            } else {
                window.location.href = "worker.html";
            }
        }

    } catch (error) {
        alert("Login Error");
        console.log(error);
    }
});
