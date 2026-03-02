const resetForm = document.getElementById("resetForm");
const welcome = document.createElement("h3");
const container = document.querySelector(".form-container");
container.insertBefore(welcome, resetForm);


const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!user || !user.email) {
    alert("You must login first");
    window.location.href = "login.html";
} else {
    welcome.textContent = `Hi ${user.name}, reset your password below!`;
}

resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/auth/resetPassword", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,   
                newPassword
            })
        });

        const data = await res.json();

        if (res.ok) {
            welcome.textContent = `Password reset successful, ${user.name}!`;
        } else {
            welcome.textContent = `Error: ${data.message}`;
        }

    } catch (err) {
        console.log(err);
        welcome.textContent = "Error resetting password";
    }
});
