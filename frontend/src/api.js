const BASE_URL = "http://localhost:5000/api";

export const authAPI = {
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

export const productsAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/products`).then((r) => r.json()),

  getByEmail: (email) =>
    fetch(`${BASE_URL}/products/user/${email}`).then((r) => r.json()),

  create: (data) =>
    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),
  
  update: (id, data) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};