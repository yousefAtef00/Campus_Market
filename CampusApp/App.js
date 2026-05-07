//npx expo start --offline --clear

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";

const BASE_URL = "https://campus-market.fly.dev/api"; 

const authAPI = {
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
  getUsers: () =>
    fetch(`${BASE_URL}/auth/users`).then((r) => r.json()),
  updatePermission: (id, permission, action) =>
    fetch(`${BASE_URL}/auth/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permission, action }),
    }).then((r) => r.json()),
  resetPassword: (email, newPassword) =>
    fetch(`${BASE_URL}/auth/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    }).then((r) => r.json()),
  forgetPassword: (email, name, newPassword) =>
    fetch(`${BASE_URL}/auth/forgetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, newPassword }),
    }).then((r) => r.json()),
};

const productsAPI = {
  getAll: () => fetch(`${BASE_URL}/products`).then((r) => r.json()),
  getByEmail: (email) =>
    fetch(`${BASE_URL}/products/user/${email}`).then((r) => r.json()),
  create: (data) =>
    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  delete: (id) =>
    fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" }).then((r) =>
      r.json()
    ),
  update: (id, data) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  buy: (id) =>
    fetch(`${BASE_URL}/products/buy/${id}`, { method: "PUT" }).then((r) =>
      r.json()
    ),
  approve: (id) =>
    fetch(`${BASE_URL}/products/${id}/approve`, { method: "PUT" }).then((r) =>
      r.json()
    ),
  reject: (id) =>
    fetch(`${BASE_URL}/products/${id}/reject`, { method: "PUT" }).then((r) =>
      r.json()
    ),
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
    fetch(`${BASE_URL}/swaps/${id}`, { method: "DELETE" }).then((r) =>
      r.json()
    ),
};

const hasPermission = (user, permission) =>
  user?.permissions?.includes(permission) || false;


const C = {
  bg: "#081b29",
  accent: "#00abf0",
  card: "#0d2137",
  border: "rgba(0,171,240,0.3)",
  white: "#ffffff",
  gray: "rgba(255,255,255,0.6)",
  red: "#e74c3c",
  green: "#2ecc71",
  yellow: "#f39c12",
};



function Btn({ title, onPress, color, style, textStyle, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: color || C.accent,
          borderRadius: 40,
          paddingVertical: 13,
          paddingHorizontal: 20,
          alignItems: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={[{ color: "#fff", fontWeight: "600", fontSize: 15 }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function InputField({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={C.gray}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType || "default"}
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1.5,
        borderColor: C.border,
        borderRadius: 40,
        color: C.white,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 14,
        marginBottom: 14,
      }}
    />
  );
}


function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showForget, setShowForget] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authAPI.login({ email: form.email, password: form.password });
        if (res.user) {
          onLogin(res.user);
        } else {
          Alert.alert("Error", res.message || "Login failed");
        }
      } else {
        const res = await authAPI.register(form);
        if (res._id) {
          Alert.alert("Success", "Registered! Please login.");
          setIsLogin(true);
        } else {
          Alert.alert("Error", res.message || "Register failed");
        }
      }
    } catch (e) {
      Alert.alert("Error", "Network error");
    }
    setLoading(false);
  };

  if (showForget) return <ForgetPage onBack={() => setShowForget(false)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center", padding: 28 }}
      >
        <Text style={{ color: C.accent, fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 6, letterSpacing: 2 }}>
          SWAPSTER
        </Text>
        <Text style={{ color: C.gray, textAlign: "center", marginBottom: 30, fontSize: 13 }}>
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </Text>

        {!isLogin && (
          <InputField placeholder="Full Name" value={form.name} onChangeText={(v) => set("name", v)} />
        )}
        <InputField placeholder="Email" value={form.email} onChangeText={(v) => set("email", v)} keyboardType="email-address" />
        <InputField placeholder="Password" value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry />

        {!isLogin && (
          <View style={{ flexDirection: "row", marginBottom: 14, gap: 10 }}>
            {["student", "teacher"].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => set("role", r)}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 40,
                  borderWidth: 1.5,
                  borderColor: form.role === r ? C.accent : C.border,
                  backgroundColor: form.role === r ? C.accent : "transparent",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", textTransform: "capitalize", fontWeight: "600" }}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Btn title={loading ? "Please wait..." : isLogin ? "Login" : "Register"} onPress={handleSubmit} disabled={loading} style={{ marginTop: 4 }} />

        {isLogin && (
          <TouchableOpacity onPress={() => setShowForget(true)} style={{ marginTop: 14 }}>
            <Text style={{ color: C.accent, textAlign: "center", fontSize: 13 }}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 16 }}>
          <Text style={{ color: C.gray, textAlign: "center", fontSize: 13 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={{ color: C.accent, fontWeight: "600" }}>{isLogin ? "Register" : "Login"}</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ForgetPage({ onBack }) {
  const [form, setForm] = useState({ username: "", email: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.forgetPassword(form.email, form.username, form.newPassword);
      if (res.message === "Password reset successful") {
        Alert.alert("Success", "Password reset! Please login.");
        onBack();
      } else {
        Alert.alert("Error", res.message || "Something went wrong");
      }
    } catch {
      Alert.alert("Error", "Network error");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "center", padding: 28 }}>
        <Text style={{ color: C.accent, fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 24 }}>Forgot Password</Text>
        <InputField placeholder="Full Name" value={form.username} onChangeText={(v) => set("username", v)} />
        <InputField placeholder="Email" value={form.email} onChangeText={(v) => set("email", v)} keyboardType="email-address" />
        <InputField placeholder="New Password" value={form.newPassword} onChangeText={(v) => set("newPassword", v)} secureTextEntry />
        <InputField placeholder="Confirm Password" value={form.confirmPassword} onChangeText={(v) => set("confirmPassword", v)} secureTextEntry />
        <Btn title={loading ? "Please wait..." : "Reset Password"} onPress={handleSubmit} disabled={loading} />
        <TouchableOpacity onPress={onBack} style={{ marginTop: 16 }}>
          <Text style={{ color: C.gray, textAlign: "center" }}>← Back to Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function ResetPage({ user, onBack }) {
  const [pass, setPass] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (pass.new !== pass.confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.resetPassword(user.email, pass.new);
      if (res.message === "Password reset successful") {
        Alert.alert("Success", "Password reset successfully!");
        onBack();
      } else {
        Alert.alert("Error", res.message || "Something went wrong");
      }
    } catch {
      Alert.alert("Error", "Network error");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: C.white, fontSize: 22, fontWeight: "700", marginBottom: 24 }}>Reset Password</Text>
      <InputField placeholder="New Password" value={pass.new} onChangeText={(v) => setPass((p) => ({ ...p, new: v }))} secureTextEntry />
      <InputField placeholder="Confirm Password" value={pass.confirm} onChangeText={(v) => setPass((p) => ({ ...p, confirm: v }))} secureTextEntry />
      <Btn title={loading ? "Saving..." : "Save Changes"} onPress={handleReset} disabled={loading} />
      <TouchableOpacity onPress={onBack} style={{ marginTop: 16 }}>
        <Text style={{ color: C.gray, textAlign: "center" }}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}


function Categories({ categories, selected, setSelected }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
      {["All", ...categories].map((c, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setSelected(c)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 40,
            marginRight: 8,
            backgroundColor: selected === c ? C.accent : "rgba(255,255,255,0.08)",
            borderWidth: 1,
            borderColor: selected === c ? C.accent : C.border,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 13 }}>{c}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ProductCard({ product, user, products, setProducts, onEdit, addToCart, removeFromCart, cartItems }) {
  const isOwner = product.ownerEmail === user.email;
  const inCart = cartItems && cartItems.some((i) => i._id === product._id);
  const [swapModal, setSwapModal] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const loadMyProducts = async () => {
    const data = await productsAPI.getByEmail(user.email);
    setMyProducts(data.filter((p) => p.status === "Approved" && p._id !== product._id));
    setSwapModal(true);
  };

  const sendSwap = async (offered) => {
    const res = await swapAPI.send({
      targetProductId: product._id,
      targetProductName: product.name,
      targetOwnerEmail: product.ownerEmail,
      requesterEmail: user.email,
      offeredProduct: { name: offered.name, _id: offered._id },
    });
    if (res._id) {
      Alert.alert("Success", "Swap request sent!");
    } else {
      Alert.alert("Error", res.message || "Failed");
    }
    setSwapModal(false);
  };

  const handleDelete = () => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await productsAPI.delete(product._id);
          setProducts(products.filter((p) => p._id !== product._id));
        },
      },
    ]);
  };

  const handleBuy = async () => {
    const res = await productsAPI.buy(product._id);
    if (res.message) Alert.alert("Info", res.message);
    else {
      setProducts(products.map((p) => (p._id === product._id ? { ...p, status: "Sold" } : p)));
      Alert.alert("Success", "Purchased!");
    }
  };

  const statusColor = product.status === "Approved" ? C.green : product.status === "Pending" ? C.yellow : product.status === "Sold" ? C.gray : product.status === "Swapped" ? C.accent : C.red;

  return (
    <View style={styles.card}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={{ width: "100%", height: 140, borderRadius: 10, marginBottom: 10 }} resizeMode="cover" />
      ) : (
        <View style={{ width: "100%", height: 100, backgroundColor: "rgba(0,171,240,0.1)", borderRadius: 10, marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 30 }}>📦</Text>
        </View>
      )}
      <Text style={{ color: C.white, fontWeight: "700", fontSize: 15, marginBottom: 4 }}>{product.name}</Text>
      <Text style={{ color: C.gray, fontSize: 12, marginBottom: 6 }}>{product.description}</Text>
      <Text style={{ color: C.accent, fontWeight: "700", fontSize: 15, marginBottom: 4 }}>${product.price}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ color: C.gray, fontSize: 11 }}>{product.category}</Text>
        <Text style={{ color: statusColor, fontSize: 11, fontWeight: "600" }}>{product.status}</Text>
      </View>

      {isOwner ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {onEdit && <Btn title="Edit" onPress={() => onEdit(product)} style={{ flex: 1 }} />}
          <Btn title="Delete" onPress={handleDelete} color={C.red} style={{ flex: 1 }} />
        </View>
      ) : product.status === "Approved" ? (
        <View style={{ gap: 8 }}>
          <Btn title="Buy" onPress={handleBuy} color={C.green} />
          <Btn
            title={inCart ? "Remove from Cart" : "Add to Cart"}
            onPress={() => inCart ? removeFromCart && removeFromCart(product._id) : addToCart && addToCart(product)}
            color={inCart ? C.yellow : C.accent}
          />
          <Btn title="Request Swap" onPress={loadMyProducts} color="#534AB7" />
        </View>
      ) : null}

      {/* Swap Modal */}
      <Modal visible={swapModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "70%" }}>
            <Text style={{ color: C.white, fontSize: 16, fontWeight: "700", marginBottom: 14 }}>Choose a product to offer</Text>
            {myProducts.length === 0 ? (
              <Text style={{ color: C.gray }}>No approved products to swap</Text>
            ) : (
              <FlatList
                data={myProducts}
                keyExtractor={(i) => i._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => sendSwap(item)} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
                    <Text style={{ color: C.white }}>{item.name}</Text>
                    <Text style={{ color: C.gray, fontSize: 12 }}>${item.price}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <Btn title="Cancel" onPress={() => setSwapModal(false)} color={C.red} style={{ marginTop: 12 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const defaultCategories = ["Electronics", "Books", "Clothes", "bags", "Other"];

function ProductModal({ visible, onClose, user, products, setProducts, editProduct }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Other", image: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        description: editProduct.description || "",
        price: String(editProduct.price || ""),
        category: editProduct.category || "Other",
        image: editProduct.image || "",
      });
    } else {
      setForm({ name: "", description: "", price: "", category: "Other", image: "" });
    }
  }, [editProduct, visible]);

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      Alert.alert("Error", "Name and price are required");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), ownerEmail: user.email, ownerName: user.name };
      if (editProduct) {
        const res = await productsAPI.update(editProduct._id, payload);
        setProducts(products.map((p) => (p._id === editProduct._id ? res : p)));
      } else {
        const res = await productsAPI.create(payload);
        if (res._id) setProducts([...products, res]);
      }
      onClose();
    } catch {
      Alert.alert("Error", "Network error");
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <Text style={{ color: C.white, fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              {editProduct ? "Edit Product" : "Add Product"}
            </Text>
            <ScrollView>
              <InputField placeholder="Product Name" value={form.name} onChangeText={(v) => set("name", v)} />
              <InputField placeholder="Description" value={form.description} onChangeText={(v) => set("description", v)} />
              <InputField placeholder="Price" value={form.price} onChangeText={(v) => set("price", v)} keyboardType="numeric" />
              <InputField placeholder="Image URL (optional)" value={form.image} onChangeText={(v) => set("image", v)} />
              <Text style={{ color: C.gray, marginBottom: 8, fontSize: 13 }}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {defaultCategories.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => set("category", c)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 40,
                      marginRight: 8,
                      backgroundColor: form.category === c ? C.accent : "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: form.category === c ? C.accent : C.border,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 13 }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Btn title={loading ? "Saving..." : editProduct ? "Update" : "Add Product"} onPress={handleSubmit} disabled={loading} />
              <Btn title="Cancel" onPress={onClose} color={C.red} style={{ marginTop: 8, marginBottom: 10 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}


function Dashboard({ user, addToCart, removeFromCart, cartItems }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await productsAPI.getAll();
      const approved = Array.isArray(data) ? data.filter((p) => p.status === "Approved") : [];
      setProducts(approved);
      setCategories([...new Set(approved.map((p) => p.category))]);
      setLoading(false);
    })();
  }, []);

  const filtered = products
    .filter((p) => selected === "All" || p.category === selected)
    .filter((p) =>
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    );

  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={C.accent} size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>Available Products</Text>
      <View style={{ position: "relative", marginBottom: 14 }}>
        <TextInput
          placeholder="Search products..."
          placeholderTextColor={C.gray}
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1.5,
            borderColor: C.border,
            borderRadius: 40,
            color: C.white,
            paddingHorizontal: 18,
            paddingVertical: 11,
            paddingRight: 44,
            fontSize: 13,
          }}
        />
        <Text style={{ position: "absolute", right: 16, top: 11, fontSize: 16 }}>🔍</Text>
      </View>
      {search ? <Text style={{ color: C.gray, fontSize: 11, marginBottom: 8 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</Text> : null}
      <Categories categories={categories} selected={selected} setSelected={setSelected} />
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            user={user}
            products={products}
            setProducts={setProducts}
            onEdit={null}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cartItems={cartItems}
          />
        )}
        ListEmptyComponent={<Text style={{ color: C.gray, textAlign: "center", marginTop: 40 }}>No products found</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


function ProductsPage({ user, addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = user.role === "admin" ? await productsAPI.getAll() : await productsAPI.getByEmail(user.email);
    const arr = Array.isArray(data) ? data : [];
    setProducts(arr);
    setCategories([...new Set(arr.map((p) => p.category))]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = selected === "All" ? products : products.filter((p) => p.category === selected);

  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={C.accent} size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>My Products</Text>
      <Categories categories={categories} selected={selected} setSelected={setSelected} />
      {user.role !== "admin" && (
        <Btn title="+ Add Product" onPress={() => { setEditProduct(null); setModalOpen(true); }} style={{ marginBottom: 14 }} />
      )}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            user={user}
            products={products}
            setProducts={setProducts}
            onEdit={(p) => { setEditProduct(p); setModalOpen(true); }}
            addToCart={addToCart}
            cartItems={[]}
          />
        )}
        ListEmptyComponent={<Text style={{ color: C.gray, textAlign: "center", marginTop: 40 }}>No products yet</Text>}
        showsVerticalScrollIndicator={false}
      />
      <ProductModal
        visible={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        user={user}
        products={products}
        setProducts={setProducts}
        editProduct={editProduct}
      />
    </View>
  );
}

function OrdersPage({ user, onSwapAccepted }) {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [r, s] = await Promise.all([swapAPI.getReceived(user.email), swapAPI.getSent(user.email)]);
      setReceived(Array.isArray(r) ? r : []);
      setSent(Array.isArray(s) ? s : []);
      setLoading(false);
    })();
  }, []);

  const handleStatus = async (id, status) => {
    const res = await swapAPI.updateStatus(id, status);
    if (res._id) {
      setReceived(received.map((s) => (s._id === id ? { ...s, status } : s)));
      if (status === "Accepted" && onSwapAccepted) onSwapAccepted();
    }
  };

  const handleDelete = async (id) => {
    await swapAPI.delete(id);
    setSent(sent.filter((s) => s._id !== id));
  };

  const statusColor = (s) => s === "Accepted" ? C.green : s === "Rejected" ? C.red : C.yellow;

  const renderSwap = ({ item }) => (
    <View style={[styles.card, { marginBottom: 10 }]}>
      <Text style={{ color: C.white, fontWeight: "600", marginBottom: 4 }}>
        {tab === "received" ? `From: ${item.requesterEmail}` : `To: ${item.targetOwnerEmail}`}
      </Text>
      <Text style={{ color: C.gray, fontSize: 12 }}>Target: {item.targetProductName}</Text>
      <Text style={{ color: C.gray, fontSize: 12 }}>Offered: {item.offeredProduct?.name}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: statusColor(item.status), fontWeight: "600" }}>{item.status}</Text>
        {tab === "received" && item.status === "Pending" && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn title="Accept" onPress={() => handleStatus(item._id, "Accepted")} color={C.green} style={{ paddingHorizontal: 14, paddingVertical: 7 }} textStyle={{ fontSize: 12 }} />
            <Btn title="Reject" onPress={() => handleStatus(item._id, "Rejected")} color={C.red} style={{ paddingHorizontal: 14, paddingVertical: 7 }} textStyle={{ fontSize: 12 }} />
          </View>
        )}
        {tab === "sent" && item.status === "Pending" && (
          <Btn title="Cancel" onPress={() => handleDelete(item._id)} color={C.red} style={{ paddingHorizontal: 14, paddingVertical: 7 }} textStyle={{ fontSize: 12 }} />
        )}
      </View>
    </View>
  );

  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={C.accent} size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>Orders</Text>
      <View style={{ flexDirection: "row", marginBottom: 16, gap: 10 }}>
        {["received", "sent"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 40,
              borderWidth: 1.5,
              borderColor: tab === t ? C.accent : C.border,
              backgroundColor: tab === t ? C.accent : "transparent",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", textTransform: "capitalize", fontWeight: "600" }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={tab === "received" ? received : sent}
        keyExtractor={(i) => i._id}
        renderItem={renderSwap}
        ListEmptyComponent={<Text style={{ color: C.gray, textAlign: "center", marginTop: 40 }}>No swaps</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage("");
    setLoading(true);
    setChat((prev) => [...prev, { user: userMsg, bot: null }]);
    try {
      const res = await fetch(`${BASE_URL.replace("/api", "")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChat((prev) =>
        prev.map((c, i) => (i === prev.length - 1 ? { ...c, bot: data.reply } : c))
      );
    } catch {
      setChat((prev) =>
        prev.map((c, i) => (i === prev.length - 1 ? { ...c, bot: "⚠️ Failed to connect to server" } : c))
      );
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>💬 AI Chat</Text>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {chat.length === 0 && (
          <Text style={{ color: C.gray, textAlign: "center", marginTop: 60 }}>🤖 Start the conversation...</Text>
        )}
        {chat.map((c, i) => (
          <View key={i}>
            <View style={[chatStyles.bubble, chatStyles.userBubble]}>
              <Text style={{ color: "#fff", fontSize: 14 }}>{c.user}</Text>
            </View>
            <View style={[chatStyles.bubble, chatStyles.botBubble]}>
              {c.bot === null ? (
                <Text style={{ color: "#999", fontStyle: "italic", fontSize: 13 }}>thinking...</Text>
              ) : (
                <Text style={{ color: "#333", fontSize: 14 }}>{c.bot}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flexDirection: "row", gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            placeholder="Type your message..."
            placeholderTextColor={C.gray}
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1.5,
              borderColor: C.border,
              borderRadius: 40,
              color: C.white,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
            }}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            style={{ backgroundColor: "#534AB7", borderRadius: 40, paddingHorizontal: 18, justifyContent: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const chatStyles = StyleSheet.create({
  bubble: { maxWidth: "80%", padding: 10, borderRadius: 16, marginBottom: 6 },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#534AB7", borderBottomRightRadius: 4 },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#f4f4f4", borderBottomLeftRadius: 4 },
});

function SettingsPage({ user }) {
  const [showReset, setShowReset] = useState(false);
  if (showReset) return <ResetPage user={user} onBack={() => setShowReset(false)} />;
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>Settings</Text>
      <View style={styles.card}>
        <Text style={{ color: C.white, fontSize: 16, fontWeight: "600", marginBottom: 4 }}>{user.name}</Text>
        <Text style={{ color: C.gray, fontSize: 13, marginBottom: 2 }}>{user.email}</Text>
        <Text style={{ color: C.accent, fontSize: 12, textTransform: "capitalize" }}>{user.role}</Text>
      </View>
      <Btn title="Reset Password" onPress={() => setShowReset(true)} style={{ marginTop: 16 }} />
    </View>
  );
}


function AdminPage({ user }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (hasPermission(user, "canApproveOrRejectProducts") || hasPermission(user, "canDeleteApprovedProduct")) {
        const p = await productsAPI.getAll();
        setProducts(Array.isArray(p) ? p : []);
      }
      if (hasPermission(user, "canShowAllUsersDetails") || hasPermission(user, "canGivePermissionToUser")) {
        const u = await authAPI.getUsers();
        setUsers(Array.isArray(u) ? u : []);
      }
      setLoading(false);
    })();
  }, []);

  const handleApprove = async (id) => {
    await productsAPI.approve(id);
    setProducts(products.map((p) => (p._id === id ? { ...p, status: "Approved" } : p)));
  };

  const handleReject = async (id) => {
    await productsAPI.reject(id);
    setProducts(products.map((p) => (p._id === id ? { ...p, status: "Rejected" } : p)));
  };

  const handleDeleteProduct = async (id) => {
    await productsAPI.delete(id);
    setProducts(products.filter((p) => p._id !== id));
  };

  const handlePermission = async (userId, permission, action) => {
    const res = await authAPI.updatePermission(userId, permission, action);
    if (res._id) setUsers(users.map((u) => (u._id === userId ? res : u)));
    else Alert.alert("Error", res.message || "Failed");
  };

  const allPermissions = ["canApproveOrRejectProducts", "canDeleteApprovedProduct", "canShowAllUsersDetails", "canGivePermissionToUser"];

  if (loading) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><ActivityIndicator color={C.accent} size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.pageTitle}>Admin Panel</Text>
      <View style={{ flexDirection: "row", marginBottom: 16, gap: 10 }}>
        {["products", "users"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 40,
              borderWidth: 1.5,
              borderColor: tab === t ? C.accent : C.border,
              backgroundColor: tab === t ? C.accent : "transparent",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", textTransform: "capitalize", fontWeight: "600" }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "products" && (
        <FlatList
          data={products}
          keyExtractor={(i) => i._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, { marginBottom: 10 }]}>
              <Text style={{ color: C.white, fontWeight: "600" }}>{item.name}</Text>
              <Text style={{ color: C.gray, fontSize: 12, marginBottom: 4 }}>{item.ownerEmail}</Text>
              <Text style={{ color: item.status === "Approved" ? C.green : item.status === "Pending" ? C.yellow : C.red, fontSize: 12, marginBottom: 8 }}>{item.status}</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {hasPermission(user, "canApproveOrRejectProducts") && item.status === "Pending" && (
                  <>
                    <Btn title="Approve" onPress={() => handleApprove(item._id)} color={C.green} style={{ flex: 1, paddingVertical: 8 }} textStyle={{ fontSize: 12 }} />
                    <Btn title="Reject" onPress={() => handleReject(item._id)} color={C.red} style={{ flex: 1, paddingVertical: 8 }} textStyle={{ fontSize: 12 }} />
                  </>
                )}
                {hasPermission(user, "canDeleteApprovedProduct") && item.status === "Approved" && (
                  <Btn title="Delete" onPress={() => handleDeleteProduct(item._id)} color={C.red} style={{ flex: 1, paddingVertical: 8 }} textStyle={{ fontSize: 12 }} />
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: C.gray, textAlign: "center", marginTop: 40 }}>No products</Text>}
        />
      )}

      {tab === "users" && (
        <FlatList
          data={users}
          keyExtractor={(i) => i._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.card, { marginBottom: 10 }]}>
              <Text style={{ color: C.white, fontWeight: "600" }}>{item.name}</Text>
              <Text style={{ color: C.gray, fontSize: 12, marginBottom: 8 }}>{item.email}</Text>
              {hasPermission(user, "canGivePermissionToUser") && item.email !== "0@gmail.com" && (
                <View>
                  {allPermissions.map((perm) => {
                    const hasPerm = item.permissions?.includes(perm);
                    return (
                      <View key={perm} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <Text style={{ color: C.gray, fontSize: 11, flex: 1 }}>{perm}</Text>
                        <Btn
                          title={hasPerm ? "Revoke" : "Give"}
                          onPress={() => handlePermission(item._id, perm, hasPerm ? "revoke" : "give")}
                          color={hasPerm ? C.red : C.green}
                          style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                          textStyle={{ fontSize: 11 }}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: C.gray, textAlign: "center", marginTop: 40 }}>No users</Text>}
        />
      )}
    </View>
  );
}


function CartModal({ visible, onClose, cartItems, removeFromCart, user }) {
  const handleBuy = async (item) => {
    const res = await productsAPI.buy(item._id);
    Alert.alert("Info", res.message || "Purchased!");
    removeFromCart(item._id);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "70%" }}>
          <Text style={{ color: C.white, fontSize: 18, fontWeight: "700", marginBottom: 14 }}>🛒 Cart ({cartItems.length})</Text>
          {cartItems.length === 0 ? (
            <Text style={{ color: C.gray, textAlign: "center", marginVertical: 20 }}>Cart is empty</Text>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={(i) => i._id}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.white }}>{item.name}</Text>
                    <Text style={{ color: C.accent }}>${item.price}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Btn title="Buy" onPress={() => handleBuy(item)} color={C.green} style={{ paddingHorizontal: 12, paddingVertical: 7 }} textStyle={{ fontSize: 12 }} />
                    <Btn title="Remove" onPress={() => removeFromCart(item._id)} color={C.red} style={{ paddingHorizontal: 12, paddingVertical: 7 }} textStyle={{ fontSize: 12 }} />
                  </View>
                </View>
              )}
            />
          )}
          <Btn title="Close" onPress={onClose} color={C.red} style={{ marginTop: 12 }} />
        </View>
      </View>
    </Modal>
  );
}


const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "🏠" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "orders", label: "Orders", icon: "🔄" },
  { key: "chat", label: "AI Chat", icon: "💬" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

function BottomNav({ currentPage, setPage, cartCount, openCart, user }) {
  const showAdmin =
    hasPermission(user, "canGivePermissionToUser") ||
    hasPermission(user, "canApproveOrRejectProducts") ||
    hasPermission(user, "canShowAllUsersDetails") ||
    hasPermission(user, "canDeleteApprovedProduct");

  const items = showAdmin ? [...NAV_ITEMS, { key: "admin", label: "Admin", icon: "🛡️" }] : NAV_ITEMS;

  return (
    <View style={{ flexDirection: "row", backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: Platform.OS === "ios" ? 20 : 6, paddingTop: 6 }}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => setPage(item.key)}
          style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}
        >
          <Text style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</Text>
          <Text style={{ color: currentPage === item.key ? C.accent : C.gray, fontSize: 10, fontWeight: currentPage === item.key ? "700" : "400" }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={openCart} style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}>
        <View style={{ position: "relative" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>🛒</Text>
          {cartCount > 0 && (
            <View style={{ position: "absolute", top: -4, right: -6, backgroundColor: C.red, borderRadius: 10, width: 16, height: 16, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={{ color: C.gray, fontSize: 10 }}>Cart</Text>
      </TouchableOpacity>
    </View>
  );
}


export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [cartItems, setCartItems] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  const addToCart = (product) => {
    if (!cartItems.find((i) => i._id === product._id)) {
      setCartItems([...cartItems, product]);
    }
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter((i) => i._id !== id));

  const handleLogout = () => {
    setUser(null);
    setPage("dashboard");
    setCartItems([]);
  };

  if (!user) return <AuthForm onLogin={setUser} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard user={user} addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} />;
      case "products":
        return <ProductsPage user={user} addToCart={addToCart} />;
      case "orders":
        return <OrdersPage user={user} />;
      case "chat":
        return <ChatPage />;
      case "settings":
        return <SettingsPage user={user} onLogout={handleLogout} />;
      case "admin":
        return <AdminPage user={user} />;
      default:
        return <Dashboard user={user} addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Text style={{ color: C.accent, fontSize: 20, fontWeight: "700", letterSpacing: 2 }}>SWAPSTER</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ color: C.gray, fontSize: 12 }}>{user.name}</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={{ borderWidth: 1, borderColor: C.red, borderRadius: 40, paddingHorizontal: 12, paddingVertical: 5 }}
          >
            <Text style={{ color: C.red, fontSize: 12 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Content */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {renderPage()}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        currentPage={page}
        setPage={setPage}
        cartCount={cartItems.length}
        openCart={() => setCartVisible(true)}
        user={user}
      />

      {/* Cart Modal */}
      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        user={user}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  pageTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
});