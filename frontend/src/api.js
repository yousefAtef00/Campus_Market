const BASE_URL = "https://campus-market.fly.dev/api";

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

  buy: (id) =>
    fetch(`${BASE_URL}/products/buy/${id}`, {
      method: "PUT",
    }).then((r) => r.json()),
};

export const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission) || false;
};


export const swapAPI = {
  send: (data) =>
    fetch(`${BASE_URL}/swaps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getReceived: (email) =>
    fetch(`${BASE_URL}/swaps/received/${email}`).then((r) => r.json()),

  getSent: (email) =>
    fetch(`${BASE_URL}/swaps/sent/${email}`).then((r) => r.json()),

  updateStatus: (id, status) =>
    fetch(`${BASE_URL}/swaps/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/swaps/${id}`, { method: "DELETE" }).then((r) => r.json()),
};