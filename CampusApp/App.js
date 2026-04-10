//npx expo start --offline --clear
//ngrok http --domain=curdy-nonputrescent-kerrie.ngrok-free.dev 5000
//https://curdy-nonputrescent-kerrie.ngrok-free.dev/api
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Alert, ScrollView,
  Modal, Image, ActivityIndicator
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const BASE_URL = "https://curdy-nonputrescent-kerrie.ngrok-free.dev/api";
const ROOT_ADMIN_EMAIL = "0@gmail.com";

//API
const authAPI = {
  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  resetPassword: (data) =>
    fetch(`${BASE_URL}/auth/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  forgetPassword: (data) =>
    fetch(`${BASE_URL}/auth/forgetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getUsers: () =>
    fetch(`${BASE_URL}/auth/users`).then((r) => r.json()),

  updatePermission: (id, data) =>
    fetch(`${BASE_URL}/auth/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

const productsAPI = {
  getAll: () => fetch(`${BASE_URL}/products`).then((r) => r.json()),
  getByEmail: (email) => fetch(`${BASE_URL}/products/user/${email}`).then((r) => r.json()),
  create: (data) =>
    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  update: (id, data) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  delete: (id) =>
    fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" }).then((r) => r.json()),
  buy: (id) =>
    fetch(`${BASE_URL}/products/buy/${id}`, { method: "PUT" }).then((r) => r.json()),
  updateStatus: (id, status) =>
    fetch(`${BASE_URL}/products/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
};


const swapAPI = {
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

const hasPermission = (user, permission) => {
  return user?.permissions?.includes(permission) || false;
};

//AUTH SCREEN 
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [anim] = useState(new Animated.Value(0));
  const [showForget, setShowForget] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const roles = [
    { label: "Student", value: "student" },
    { label: "Professor", value: "teacher" },
    { label: "Worker", value: "worker" },
  ];

  const toggle = () => {
    Animated.timing(anim, { toValue: isLogin ? 1 : 0, duration: 400, useNativeDriver: true }).start();
    setIsLogin(!isLogin);
  };

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -width] });

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) { Alert.alert("Error", "Please fill all fields"); return; }
    setLoginLoading(true);
    const res = await authAPI.login({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);
    if (res.user) { onLogin(res.user); } else { Alert.alert("Error", res.message || "Login failed"); }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword || !role) { Alert.alert("Error", "Please fill all fields and select a role"); return; }
    setRegLoading(true);
    const res = await authAPI.register({ name: regName, email: regEmail, password: regPassword, role });
    setRegLoading(false);
    if (res._id) { Alert.alert("Success", "Registered successfully! Please login."); toggle(); }
    else { Alert.alert("Error", res.message || "Register failed"); }
  };

  if (showForget) return <ForgetPasswordScreen onBack={() => setShowForget(false)} />;

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>SWAPSTER</Text>
      <View style={styles.switchContainer}>
        <TouchableOpacity onPress={() => !isLogin && toggle()}>
          <Text style={[styles.switchText, isLogin && styles.active]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => isLogin && toggle()}>
          <Text style={[styles.switchText, !isLogin && styles.active]}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.overflowWrapper}>
        <Animated.View style={[styles.formContainer, { transform: [{ translateX }] }]}>
          <View style={styles.form}>
            <TextInput placeholder="Email" placeholderTextColor="#94a3b8" style={styles.input} onChangeText={setLoginEmail} value={loginEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} onChangeText={setLoginPassword} value={loginPassword} />
            <TouchableOpacity onPress={() => setShowForget(true)}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loginLoading}>
              {loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <TextInput placeholder="Name" placeholderTextColor="#94a3b8" style={styles.input} onChangeText={setRegName} value={regName} />
            <TextInput placeholder="Email" placeholderTextColor="#94a3b8" style={styles.input} onChangeText={setRegEmail} value={regEmail} keyboardType="email-address" autoCapitalize="none" />
            <Dropdown style={styles.dropdown} placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle} data={roles} labelField="label" valueField="value" placeholder="Select Role" value={role} onChange={(item) => setRole(item.value)} />
            <TextInput placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} onChangeText={setRegPassword} value={regPassword} />
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={regLoading}>
              {regLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

//FORGET PASSWORD 
function ForgetPasswordScreen({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !newPassword || !confirmPassword) { Alert.alert("Error", "Please fill all fields"); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Error", "Passwords do not match"); return; }
    setLoading(true);
    const res = await authAPI.forgetPassword({ name: username, email, newPassword });
    setLoading(false);
    if (res.message === "Password reset successful") { Alert.alert("Success", "Password updated! Please login."); onBack(); }
    else { Alert.alert("Error", res.message || "Something went wrong"); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>Forget Password</Text>
      <TextInput placeholder="Username" placeholderTextColor="#94a3b8" style={styles.input} onChangeText={setUsername} />
      <TextInput placeholder="Email" placeholderTextColor="#94a3b8" style={styles.input} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="New Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} onChangeText={setNewPassword} />
      <TextInput placeholder="Confirm Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} onChangeText={setConfirmPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#38bdf8" }]} onPress={onBack}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

//DASHBOARD 
function DashboardScreen({ user, setPage, onSwapAccepted }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [swapModal, setSwapModal] = useState(null); 
  const [swapForm, setSwapForm] = useState({ name: "", description: "", image: "", price: "", condition: "" });
  const [swapSent, setSwapSent] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productsAPI.getAll();
      const approved = data.filter((p) => p.status === "Approved");
      setProducts(approved);
      const cats = [...new Set(approved.map((p) => p.category))];
      setCategories(cats);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => selected === "All" || p.category === selected)
    .filter((p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    );

  const buyProduct = async (id) => {
    const res = await productsAPI.buy(id);
    if (res._id) {
      setProducts(products.map((p) => p._id === id ? { ...p, isbuyer: true } : p));
    } else {
      Alert.alert("Error", res.message || "Failed to buy");
    }
  };

  const sendSwap = async () => {
    if (!swapForm.name) { Alert.alert("Error", "Please enter your product name"); return; }
    const res = await swapAPI.send({
      targetProductId: swapModal._id,
      targetProductName: swapModal.name,
      targetOwnerEmail: swapModal.ownerEmail,
      requesterEmail: user.email,
      offeredProduct: swapForm,
    });
    if (res._id) { setSwapSent(true); }
    else { Alert.alert("Error", res.message || "Failed to send swap request"); }
  };

  const closeSwap = () => {
    setSwapModal(null);
    setSwapSent(false);
    setSwapForm({ name: "", description: "", image: "", price: "", condition: "" });
  };

  const isAdmin =
    hasPermission(user, "canGivePermissionToUser") ||
    hasPermission(user, "canApproveOrRejectProducts") ||
    hasPermission(user, "canShowAllUsersDetails") ||
    hasPermission(user, "canDeleteApprovedProduct");

  const conditionOptions = [
    { label: "Like New", value: "Like New" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Used", value: "Used" },
  ];

  if (loading) return <ActivityIndicator color="#38bdf8" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.dashHeader}>
        <Text style={styles.welcomeText}>Welcome, {user.name}! 👋</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.adminBtn} onPress={() => setPage("admin")}>
            <Text style={styles.adminBtnText}>Admin Panel</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by name, category or price..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      {search ? <Text style={styles.searchResult}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</Text> : null}

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        <TouchableOpacity style={[styles.categoryBtn, selected === "All" && styles.categoryBtnActive]} onPress={() => setSelected("All")}>
          <Text style={styles.categoryBtnText}>All</Text>
        </TouchableOpacity>
        {categories.map((c, i) => (
          <TouchableOpacity key={i} style={[styles.categoryBtn, selected === c && styles.categoryBtnActive]} onPress={() => setSelected(c)}>
            <Text style={styles.categoryBtnText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Available Products</Text>
      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>{search ? "No products match your search" : "No products available"}</Text>
      ) : (
        filtered.map((p) => (
          <View key={p._id} style={styles.productCard}>
            {p.image ? <Image source={{ uri: p.image }} style={styles.productImage} /> : null}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productDesc}>{p.description}</Text>
              <Text style={styles.productPrice}>💰 ${p.price}</Text>
              <Text style={styles.productCategory}>📦 {p.category}</Text>
              <Text style={[styles.productStatus, { color: p.isbuyer ? "#ef4444" : "#22c55e" }]}>
                {p.isbuyer ? "Sold Out" : "Available"}
              </Text>
              {p.ownerEmail !== user.email && !p.isbuyer && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <TouchableOpacity style={styles.buyBtn} onPress={() => buyProduct(p._id)}>
                    <Text style={styles.buyBtnText}>Buy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.swapBtn} onPress={() => setSwapModal(p)}>
                    <Text style={styles.swapBtnText}>⇄ Swap</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))
      )}
      <Modal visible={!!swapModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            {swapSent ? (
              <View style={{ alignItems: "center", padding: 20 }}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>✅</Text>
                <Text style={styles.modalTitle}>Swap request sent!</Text>
                <Text style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
                  The seller will review your offer and respond soon.
                </Text>
                <TouchableOpacity style={styles.button} onPress={closeSwap}>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>⇄ Swap Request</Text>
                <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 12 }}>
                  You want: <Text style={{ color: "#38bdf8" }}>{swapModal?.name}</Text> from {swapModal?.ownerEmail}
                </Text>
                <TextInput placeholder="Your product name *" placeholderTextColor="#94a3b8" style={styles.input} value={swapForm.name} onChangeText={(v) => setSwapForm({ ...swapForm, name: v })} />
                <TextInput placeholder="Description" placeholderTextColor="#94a3b8" style={[styles.input, { height: 80 }]} value={swapForm.description} onChangeText={(v) => setSwapForm({ ...swapForm, description: v })} multiline />
                <TextInput placeholder="Image URL" placeholderTextColor="#94a3b8" style={styles.input} value={swapForm.image} onChangeText={(v) => setSwapForm({ ...swapForm, image: v })} />
                <TextInput placeholder="Estimated value ($)" placeholderTextColor="#94a3b8" style={styles.input} value={swapForm.price} onChangeText={(v) => setSwapForm({ ...swapForm, price: v })} keyboardType="numeric" />
                <Dropdown style={styles.dropdown} placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle}
                  data={conditionOptions} labelField="label" valueField="value" placeholder="Condition"
                  value={swapForm.condition} onChange={(item) => setSwapForm({ ...swapForm, condition: item.value })} />
                <TouchableOpacity style={styles.button} onPress={sendSwap}>
                  <Text style={styles.buttonText}>Send Offer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#38bdf8" }]} onPress={closeSwap}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ORDERS 
function OrdersScreen({ user, onSwapAccepted }) {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwaps = async () => {
      setLoading(true);
      const [rec, sen] = await Promise.all([
        swapAPI.getReceived(user.email),
        swapAPI.getSent(user.email),
      ]);
      setReceived(Array.isArray(rec) ? rec : []);
      setSent(Array.isArray(sen) ? sen : []);
      setLoading(false);
    };
    fetchSwaps();
  }, [user]);

  const handleStatus = async (id, status) => {
    const res = await swapAPI.updateStatus(id, status);
    if (res._id) {
      setReceived(received.map((s) => {
        if (s._id === id) return { ...s, status };
        if (status === "Accepted" && s.targetProductName === res.targetProductName && s.status === "Pending") {
          return { ...s, status: "Rejected" };
        }
        return s;
      }));
      if (status === "Accepted" && onSwapAccepted) onSwapAccepted();
    }
  };

  const handleDelete = async (id) => {
    const res = await swapAPI.delete(id);
    if (res.message) setSent(sent.filter((s) => s._id !== id));
  };

  const statusColor = (s) =>
    s === "Accepted" ? "#16a34a" : s === "Rejected" ? "#dc2626" : "#f59e0b";

  if (loading) return <ActivityIndicator color="#38bdf8" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.sectionTitle}>Swap Requests</Text>

      {/* Tabs */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        {["received", "sent"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.categoryBtn, tab === t && styles.categoryBtnActive, { flex: 1, alignItems: "center" }]}
            onPress={() => setTab(t)}
          >
            <Text style={styles.categoryBtnText}>
              {t === "received" ? `Received (${received.length})` : `Sent (${sent.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Received */}
      {tab === "received" && (
        received.length === 0 ? <Text style={styles.emptyText}>No swap requests received</Text> :
          received.map((s) => (
            <View key={s._id} style={styles.adminCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>For: {s.targetProductName}</Text>
                  <Text style={styles.productDesc}>From: {s.requesterEmail}</Text>
                  <Text style={{ color: "#fff", marginTop: 6 }}>Offering: <Text style={{ color: "#38bdf8" }}>{s.offeredProduct?.name}</Text></Text>
                  {s.offeredProduct?.description ? <Text style={styles.productDesc}>{s.offeredProduct.description}</Text> : null}
                  {s.offeredProduct?.price ? <Text style={styles.productDesc}>Value: ${s.offeredProduct.price}</Text> : null}
                  {s.offeredProduct?.condition ? <Text style={styles.productDesc}>Condition: {s.offeredProduct.condition}</Text> : null}
                  {s.offeredProduct?.image ? <Image source={{ uri: s.offeredProduct.image }} style={{ width: 60, height: 60, borderRadius: 8, marginTop: 8 }} /> : null}
                </View>
                <View style={{ backgroundColor: statusColor(s.status), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>{s.status}</Text>
                </View>
              </View>
              {s.status === "Pending" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                  <TouchableOpacity style={[styles.approveBtn, { flex: 1 }]} onPress={() => handleStatus(s._id, "Accepted")}>
                    <Text style={styles.actionBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.rejectBtn, { flex: 1 }]} onPress={() => handleStatus(s._id, "Rejected")}>
                    <Text style={styles.actionBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
      )}

      {/* Sent */}
      {tab === "sent" && (
        sent.length === 0 ? <Text style={styles.emptyText}>No swap requests sent</Text> :
          sent.map((s) => (
            <View key={s._id} style={styles.adminCard}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>For: {s.targetProductName}</Text>
                  <Text style={styles.productDesc}>To: {s.targetOwnerEmail}</Text>
                  <Text style={{ color: "#fff", marginTop: 6 }}>You offered: <Text style={{ color: "#38bdf8" }}>{s.offeredProduct?.name}</Text></Text>
                </View>
                <View style={{ backgroundColor: statusColor(s.status), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>{s.status}</Text>
                </View>
              </View>
              {s.status === "Pending" && (
                <TouchableOpacity style={[styles.deleteBtn, { marginTop: 10 }]} onPress={() => handleDelete(s._id)}>
                  <Text style={styles.deleteBtnText}>Cancel Request</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
      )}
    </ScrollView>
  );
}

// PRODUCTS 
function ProductsScreen({ user, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = [
    { label: "Electronics", value: "Electronics" },
    { label: "Books", value: "Books" },
    { label: "Clothes", value: "Clothes" },
    { label: "Bags", value: "bags" },
    { label: "Other", value: "Other" },
  ];

  useEffect(() => { fetchProducts(); }, [refreshKey]); 

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productsAPI.getByEmail(user.email);
    setProducts(data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditProduct(null);
    setName(""); setDescription(""); setPrice(""); setCategory(""); setImage("");
    setModalOpen(true);
  };

  const openEdit = (product) => {
    if (product.status !== "Pending") { Alert.alert("Error", "Cannot edit approved or rejected product"); return; }
    setEditProduct(product);
    setName(product.name); setDescription(product.description);
    setPrice(String(product.price)); setCategory(product.category); setImage(product.image);
    setModalOpen(true);
  };

  const save = async () => {
    if (!name || !price || !category || !image) { Alert.alert("Error", "Please fill all fields"); return; }
    setSaving(true);
    if (editProduct) {
      const res = await productsAPI.update(editProduct._id, { name, description, price: Number(price), category, image });
      if (res._id) { setProducts(products.map((p) => p._id === res._id ? res : p)); setModalOpen(false); }
      else { Alert.alert("Error", res.message || "Failed to update product"); }
    } else {
      const res = await productsAPI.create({ name, description, price: Number(price), category, image, status: "Pending", ownerEmail: user.email, isbuyer: false });
      if (res._id) { setProducts([...products, res]); setModalOpen(false); }
      else { Alert.alert("Error", "Failed to create product"); }
    }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    Alert.alert("Confirm", "Delete this product?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        const res = await productsAPI.delete(id);
        if (res.message === "Product deleted successfully") setProducts(products.filter((p) => p._id !== id));
      }}
    ]);
  };

  if (loading) return <ActivityIndicator color="#38bdf8" style={{ flex: 1 }} />;

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <Text style={styles.addBtnText}>+ Add Product</Text>
      </TouchableOpacity>
      <ScrollView>
        {products.length === 0 ? <Text style={styles.emptyText}>No products yet</Text> : (
          products.map((p) => (
            <View key={p._id} style={styles.productCard}>
              {p.image ? <Image source={{ uri: p.image }} style={styles.productImage} /> : null}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productDesc}>{p.description}</Text>
                <Text style={styles.productPrice}>💰 ${p.price}</Text>
                <Text style={styles.productCategory}>📦 {p.category}</Text>
                <Text style={{ color: p.status === "Approved" ? "#22c55e" : p.status === "Rejected" ? "#ef4444" : "#f59e0b", fontSize: 12 }}>
                  Status: {p.status}
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  {p.status === "Pending" && (
                    <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(p)}>
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(p._id)}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editProduct ? "Edit Product" : "Add Product"}</Text>
            <TextInput placeholder="Name" placeholderTextColor="#94a3b8" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Description" placeholderTextColor="#94a3b8" style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />
            <TextInput placeholder="Image URL" placeholderTextColor="#94a3b8" style={styles.input} value={image} onChangeText={setImage} />
            <TextInput placeholder="Price" placeholderTextColor="#94a3b8" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            <Dropdown style={styles.dropdown} placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle} data={categories} labelField="label" valueField="value" placeholder="Select Category" value={category} onChange={(item) => setCategory(item.value)} />
            <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{editProduct ? "Update" : "Save"}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#38bdf8" }]} onPress={() => setModalOpen(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

//SETTINGS
function SettingsScreen({ user }) {
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) { Alert.alert("Error", "Please fill all fields"); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Error", "Passwords do not match"); return; }
    setLoading(true);
    const res = await authAPI.resetPassword({ email: user.email, newPassword });
    setLoading(false);
    if (res.message === "Password reset successful") {
      Alert.alert("Success", "Password updated!");
      setShowReset(false); setNewPassword(""); setConfirmPassword("");
    } else { Alert.alert("Error", res.message || "Something went wrong"); }
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsCard}>
        <Text style={styles.settingsLabel}>Name: {user.name}</Text>
        <Text style={styles.settingsLabel}>Email: {user.email}</Text>
        <Text style={styles.settingsLabel}>Role: {user.role}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowReset(!showReset)}>
        <Text style={styles.addBtnText}>Reset Password</Text>
      </TouchableOpacity>
      {showReset && (
        <View style={styles.settingsCard}>
          <TextInput placeholder="New Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} value={newPassword} onChangeText={setNewPassword} />
          <TextInput placeholder="Confirm Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
          <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ADMIN 
function AdminScreen({ user }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (hasPermission(user, "canApproveOrRejectProducts")) return "pending";
    if (hasPermission(user, "canShowAllUsersDetails")) return "users";
    if (hasPermission(user, "canGivePermissionToUser")) return "permissions";
    return "pending";
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const prods = await productsAPI.getAll();
      setProducts(prods);
      const usersData = await authAPI.getUsers();
      setUsers(usersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const approve = async (id) => { await productsAPI.updateStatus(id, "Approved"); setProducts(products.map((p) => p._id === id ? { ...p, status: "Approved" } : p)); };
  const reject = async (id) => { await productsAPI.updateStatus(id, "Rejected"); setProducts(products.map((p) => p._id === id ? { ...p, status: "Rejected" } : p)); };
  const remove = async (id) => { await productsAPI.delete(id); setProducts(products.filter((p) => p._id !== id)); };

  const togglePermission = async (userId, permission, hasIt) => {
    if (userId === user.id) { Alert.alert("Error", "You cannot change your own permissions!"); return; }
    const res = await authAPI.updatePermission(userId, { permission, action: hasIt ? "revoke" : "give" });
    if (res._id) { setUsers(users.map((u) => u._id === userId ? { ...u, permissions: res.permissions } : u)); }
    else { Alert.alert("Error", "Failed to update permission"); }
  };

  const pendingProducts = products.filter((p) => p.status === "Pending");
  const approvedProducts = products.filter((p) => p.status === "Approved");

  if (loading) return <ActivityIndicator color="#38bdf8" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.sectionTitle}>Admin Panel</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {hasPermission(user, "canApproveOrRejectProducts") && (
          <TouchableOpacity style={[styles.categoryBtn, activeTab === "pending" && styles.categoryBtnActive]} onPress={() => setActiveTab("pending")}>
            <Text style={styles.categoryBtnText}>Pending</Text>
          </TouchableOpacity>
        )}
        {hasPermission(user, "canDeleteApprovedProduct") && (
          <TouchableOpacity style={[styles.categoryBtn, activeTab === "approved" && styles.categoryBtnActive]} onPress={() => setActiveTab("approved")}>
            <Text style={styles.categoryBtnText}>Approved</Text>
          </TouchableOpacity>
        )}
        {hasPermission(user, "canShowAllUsersDetails") && (
          <TouchableOpacity style={[styles.categoryBtn, activeTab === "users" && styles.categoryBtnActive]} onPress={() => setActiveTab("users")}>
            <Text style={styles.categoryBtnText}>Users</Text>
          </TouchableOpacity>
        )}
        {hasPermission(user, "canGivePermissionToUser") && (
          <TouchableOpacity style={[styles.categoryBtn, activeTab === "permissions" && styles.categoryBtnActive]} onPress={() => setActiveTab("permissions")}>
            <Text style={styles.categoryBtnText}>Permissions</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {activeTab === "pending" && hasPermission(user, "canApproveOrRejectProducts") && (
        pendingProducts.length === 0 ? <Text style={styles.emptyText}>No pending products</Text> :
          pendingProducts.map((p) => (
            <View key={p._id} style={styles.adminCard}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productDesc}>${p.price} - {p.ownerEmail}</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => approve(p._id)}><Text style={styles.actionBtnText}>Approve</Text></TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => reject(p._id)}><Text style={styles.actionBtnText}>Reject</Text></TouchableOpacity>
              </View>
            </View>
          ))
      )}

      {activeTab === "approved" && hasPermission(user, "canDeleteApprovedProduct") && (
        approvedProducts.length === 0 ? <Text style={styles.emptyText}>No approved products</Text> :
          approvedProducts.map((p) => (
            <View key={p._id} style={styles.adminCard}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productDesc}>${p.price} - {p.ownerEmail}</Text>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(p._id)}><Text style={styles.deleteBtnText}>Remove</Text></TouchableOpacity>
            </View>
          ))
      )}

      {activeTab === "users" && hasPermission(user, "canShowAllUsersDetails") && (
        users.length === 0 ? <Text style={styles.emptyText}>No users</Text> :
          users.map((u) => (
            <View key={u._id} style={styles.adminCard}>
              <Text style={styles.productName}>{u.name}</Text>
              <Text style={styles.productDesc}>{u.email} - {u.role}</Text>
            </View>
          ))
      )}

      {activeTab === "permissions" && hasPermission(user, "canGivePermissionToUser") && (
        users.map((u) => {
          const isMe = u._id === user.id;
          const isProtected = u.email === ROOT_ADMIN_EMAIL;
          return (
            <View key={u._id} style={styles.adminCard}>
              <Text style={styles.productName}>{u.name}</Text>
              <Text style={styles.productDesc}>{u.email}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {["canApproveOrRejectProducts", "canDeleteApprovedProduct", "canShowAllUsersDetails", "canGivePermissionToUser"].map((perm) => {
                  const hasIt = u.permissions?.includes(perm);
                  return (
                    <TouchableOpacity key={perm}
                      style={[styles.permBtn, { backgroundColor: hasIt ? "#dc2626" : "#16a34a", opacity: (isMe || isProtected) ? 0.4 : 1 }]}
                      onPress={() => togglePermission(u._id, perm, hasIt)}
                      disabled={isMe || isProtected}>
                      <Text style={styles.actionBtnText}>{hasIt ? "Revoke" : "Give"}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

//MAIN APP 
function MainApp() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0); 
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      const res = await authAPI.getUsers();
      const updatedUser = res.find((u) => u._id === user.id);
      if (updatedUser && JSON.stringify(updatedUser.permissions) !== JSON.stringify(user.permissions)) {
        setUser((prev) => ({ ...prev, permissions: updatedUser.permissions }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (!user) {
    return <AuthScreen onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;
  }

  const navItems = [
    { key: "dashboard", label: "🏠 Home" },
    { key: "products", label: "📦 Products" },
    { key: "orders", label: "🔄 Orders" }, 
    { key: "settings", label: "⚙️ Settings" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ flex: 1, paddingTop: insets.top || 40 }}>
        {page === "dashboard" && <DashboardScreen user={user} setPage={setPage} onSwapAccepted={() => setRefreshKey(k => k + 1)} />}
        {page === "products" && <ProductsScreen user={user} refreshKey={refreshKey} />}
        {page === "orders" && <OrdersScreen user={user} onSwapAccepted={() => setRefreshKey(k => k + 1)} />}
        {page === "settings" && <SettingsScreen user={user} />}
        {page === "admin" && <AdminScreen user={user} />}
      </View>
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
        {navItems.map((item) => (
          <TouchableOpacity key={item.key} style={[styles.navItem, page === item.key && styles.navItemActive]} onPress={() => setPage(item.key)}>
            <Text style={[styles.navText, page === item.key && styles.navTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.navItem} onPress={() => setUser(null)}>
          <Text style={styles.navText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
  appTitle: { fontSize: 32, color: "#38bdf8", fontWeight: "bold", marginBottom: 30, letterSpacing: 3 },
  switchContainer: { flexDirection: "row", marginBottom: 20 },
  switchText: { color: "#94a3b8", marginHorizontal: 20, fontSize: 18 },
  active: { color: "#38bdf8", fontWeight: "bold", borderBottomWidth: 2, borderBottomColor: "#38bdf8", paddingBottom: 4 },
  overflowWrapper: { width, overflow: "hidden" },
  formContainer: { flexDirection: "row", width: width * 2 },
  form: { width, alignItems: "center" },
  input: { width: "85%", backgroundColor: "#1e293b", padding: 12, marginVertical: 8, borderRadius: 10, color: "white", borderWidth: 1, borderColor: "#334155" },
  dropdown: { width: "85%", backgroundColor: "#1e293b", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, marginVertical: 8 },
  placeholderStyle: { color: "#94a3b8", fontSize: 16 },
  selectedTextStyle: { color: "white", fontSize: 16 },
  button: { backgroundColor: "#38bdf8", padding: 13, borderRadius: 10, marginTop: 10, width: "85%", alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 15 },
  forgotText: { color: "#38bdf8", fontSize: 13, marginTop: 4, marginBottom: 4 },
  screen: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
  dashHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  welcomeText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  adminBtn: { backgroundColor: "#38bdf8", padding: 8, borderRadius: 8 },
  adminBtnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  searchContainer: { position: "relative", marginBottom: 12 },
  searchInput: { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(56,189,248,0.35)", borderRadius: 20, color: "#fff", fontSize: 13, padding: 12, paddingRight: 40 },
  searchIcon: { position: "absolute", right: 12, top: 12, fontSize: 15 },
  searchResult: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 },
  categoryBar: { marginBottom: 16 },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#38bdf8", marginRight: 8, backgroundColor: "transparent" },
  categoryBtnActive: { backgroundColor: "#38bdf8" },
  categoryBtnText: { color: "#fff", fontSize: 13 },
  sectionTitle: { fontSize: 18, color: "#38bdf8", fontWeight: "bold", marginBottom: 12 },
  emptyText: { color: "#94a3b8", textAlign: "center", marginTop: 20 },
  productCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: "row", borderWidth: 1, borderColor: "#334155" },
  productImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { color: "#38bdf8", fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  productDesc: { color: "#94a3b8", fontSize: 12, marginBottom: 4 },
  productPrice: { color: "#fff", fontSize: 13, marginBottom: 2 },
  productCategory: { color: "#94a3b8", fontSize: 12, marginBottom: 2 },
  productStatus: { fontSize: 12, marginBottom: 6 },
  buyBtn: { backgroundColor: "#16a34a", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  buyBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  swapBtn: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#f59e0b", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  swapBtnText: { color: "#f59e0b", fontWeight: "bold", fontSize: 13 },
  addBtn: { backgroundColor: "#38bdf8", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 16 },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  editBtn: { backgroundColor: "#f59e0b", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  editBtnText: { color: "#000", fontWeight: "bold", fontSize: 13 },
  deleteBtn: { backgroundColor: "#dc2626", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  deleteBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center" },
  modalContent: { backgroundColor: "#1e293b", margin: 20, borderRadius: 12, padding: 20 },
  modalTitle: { color: "#38bdf8", fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  settingsCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#334155" },
  settingsLabel: { color: "#fff", fontSize: 14, marginBottom: 6 },
  adminCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#334155" },
  approveBtn: { backgroundColor: "#16a34a", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  rejectBtn: { backgroundColor: "#dc2626", padding: 8, borderRadius: 8, flex: 1, alignItems: "center" },
  actionBtnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  permBtn: { padding: 8, borderRadius: 8, alignItems: "center" },
  bottomNav: { flexDirection: "row", backgroundColor: "#1e293b", borderTopWidth: 1, borderTopColor: "#334155", paddingVertical: 10 },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  navItemActive: { borderTopWidth: 2, borderTopColor: "#38bdf8" },
  navText: { color: "#94a3b8", fontSize: 11 },
  navTextActive: { color: "#38bdf8", fontWeight: "bold" },
});
