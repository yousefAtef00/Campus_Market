let btn = document.querySelector('#btn');
let sidebar = document.querySelector('.sidebar');
let searchBtn = document.querySelector('.bx-search');
let listItems = document.querySelectorAll('.list-item');
const buttonsContainer = document.getElementById("page-buttons");
const pageTitle = document.getElementById("page-title");

const welcome = document.getElementById("welcome");
const user = JSON.parse(localStorage.getItem("user"));
if(user.role === "student") {
    welcome.textContent = `Welcome student, ${user.name}!`;
} else if(user.role === "teacher") {
    welcome.textContent = `Welcome teacher, ${user.name}!`;
} else if(user.role === "worker") {
    welcome.textContent = `Hello worker, ${user.name}!`;
} else {
    window.location.href = "index.html"; 
}


function loadPage(page) {

    buttonsContainer.innerHTML = "";

    if (page === "dashboard") {
        pageTitle.textContent = "Dashboard";

        buttonsContainer.innerHTML = `
            <button class="btn">View Reports</button>
        `;
    }

    if (page === "products") {
        pageTitle.textContent = "Products";

        buttonsContainer.innerHTML = `
            <button class="btn">Add Product</button>
            <button class="btn">Delete Product</button>
        `;
    }

    if (page === "orders") {
        pageTitle.textContent = "Orders";

        buttonsContainer.innerHTML = `
            <button class="btn">View Orders</button>
            <button class="btn">Edit Order</button>
        `;
    }
    if (page === "messages") {
        pageTitle.textContent = "Messages";

        buttonsContainer.innerHTML = `
            <button class="btn">View Messages</button>
            <button class="btn">Send Message</button>
        `;
    }

    if (page === "settings") {
        pageTitle.textContent = "Settings";

        buttonsContainer.innerHTML = `
            <button class="btn" onclick="window.location.href='reset.html'">Reset Password</button> `;
    }
}



btn.onclick = function() {
    sidebar.classList.toggle('active');
}

searchBtn.onclick = function() {
    sidebar.classList.toggle('active');
}

function activateLink() {
    listItems.forEach(item => 
        item.classList.remove('active'));
        this.classList.add('active');
    }
listItems.forEach(item =>
    item.onclick = activateLink);
  
    