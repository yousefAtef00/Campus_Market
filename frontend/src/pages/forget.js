const BASE_URL = "http://localhost:5000/api/auth";

const forgetForm = document.getElementById("forgetForm");

forgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("forget-name").value;
    const email = document.getElementById("forget-email").value;
    const newPassword = document.getElementById("new-password").value;

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/forgetPassword`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, newPassword })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = "index.html";       }

    } catch (error) {
        alert("Error resetting password");
        console.log(error);
    }
});
