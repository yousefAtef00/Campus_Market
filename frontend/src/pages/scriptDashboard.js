let btn = document.querySelector('#btn');
let sidebar = document.querySelector('.sidebar');
let searchBtn = document.querySelector('.bx-search');
let listItems = document.querySelectorAll('.list-item');
const buttonsContainer = document.getElementById("page-buttons");
const pageTitle = document.getElementById("page-title");

const welcome = document.getElementById("welcome");
// ================= PRODUCTS SYSTEM =================

let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

function openModal(index = null) {
    document.getElementById("productModal").style.display = "flex";

    if (index !== null) {
        editIndex = index;
        document.getElementById("productName").value = products[index].name;
        document.getElementById("productDesc").value = products[index].desc;
        document.getElementById("productPrice").value = products[index].price;
    }
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    document.getElementById("productName").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productPrice").value = "";
    editIndex = null;
}
function saveProduct() {
    let name = document.getElementById("productName").value.trim();
    let desc = document.getElementById("productDesc").value.trim();
    let price = document.getElementById("productPrice").value.trim();

    if (!name || !desc || !price) {
        alert("Please fill all required fields");
        return;
    }

    let product = {
        name,
        desc,
        price,
        status: "Pending",
        ownerEmail: user.email   
    };

    if (editIndex !== null) {
        products[editIndex] = product;
    } else {
        products.push(product);
    }

    localStorage.setItem("products", JSON.stringify(products));
    closeModal();
    renderProducts();
}

function renderProducts() {
    let list = document.getElementById("products-list");
    if (!list) return;

    list.innerHTML = "";

    
    let userProducts = products.filter(p => p.ownerEmail === user.email);


    if (user.role === "admin") {
        userProducts = products;
    }

    userProducts.forEach((product, index) => {
        list.innerHTML += `
            <div style="background:white;padding:10px;margin:10px;border-radius:8px">
                <h4>${product.name}</h4>
                <p>${product.desc}</p>
                <p>Price: ${product.price}</p>
                <p>Status: ${product.status}</p>

                <button class="btn" onclick="openModal(${index})">Edit</button>
                <button class="btn" onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
    });
}


function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
}

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
        <button class="btn" onclick="openModal()">Add Product</button>
        <div id="products-list"></div>
    `;

    renderProducts();
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
  
    