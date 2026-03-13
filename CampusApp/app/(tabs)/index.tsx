////npx expo start --tunnel
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const { width } = Dimensions.get("window");

export default function App() {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [screen, setScreen] = useState("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedEmail, setLoggedEmail] = useState(""); // حفظ الإيميل بعد تسجيل الدخول

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState(null);

  // Forget password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotName, setForgotName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const roles = [
    { label: "Student", value: "student" },
    { label: "Professor", value: "teacher" },
    { label: "Worker", value: "worker" },
  ];

  // RESET PASSWORD
  const handleReset = () => {
    if (!loggedEmail) {
      Alert.alert("Error", "No user email stored. Please login first.");
      return;
    }
    if (!newPassword) {
      Alert.alert("Error", "Please enter new password");
      return;
    }

    fetch("http://172.25.14.24:5000/api/auth/resetPassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedEmail, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert("Reset Password", data.message || "Password updated!");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Server connection failed");
      });
  };

  if (screen === "reset") {
    return (
      <View style={styles.container}>
        <TextInput placeholder="New Password" style={styles.input} secureTextEntry onChangeText={setNewPassword}  value={newPassword} />
        <TextInput placeholder="Confirm New Password" style={styles.input} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setScreen("student")}>
          <Text style={styles.buttonText}>Back to student window</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "student") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Student Page</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("reset")}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("login")}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "teacher") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Teacher Page</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("reset")}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("login")}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "worker") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Worker Page</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("reset")}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("login")}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const slideToRegister = () => {
    Animated.timing(slideAnim, { toValue: -width, duration: 400, useNativeDriver: true }).start();
  };

  const slideToLogin = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
  };

  const slideToForgotReset = () => {
    Animated.timing(slideAnim, { toValue: -width * 2, duration: 400, useNativeDriver: true }).start();
  };

  const slideBackFromForgot = () => {
    Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
  };

  // LOGIN API
  const handleLogin = () => {
    fetch("http://172.25.14.24:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const role = data.user?.role;
        if (role) setLoggedEmail(data.user.email); // تخزين الايميل
        if (role === "student") setScreen("student");
        else if (role === "teacher") setScreen("teacher");
        else if (role === "worker") setScreen("worker");
        else Alert.alert("Login Failed", data.message);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Server connection failed");
      });
  };

  // REGISTER API
  const handleRegister = () => {
    fetch("http://172.25.14.24:5000/api/auth/register", {
    method: "POST",
     headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regUsername, email: regEmail, password: regPassword, role }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert("Register", data.message || "Registered successfully");
      })
      .catch((err) => console.log(err));
  };
 //
 // FORGOT PASSWORD//172.25.32.62
  const handleForgot = () => {
    fetch("http://172.25.14.24:5000/api/auth/forgetPassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email: forgotEmail, name: forgotName, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => Alert.alert("Forgot Password", data.message || "Password reset!"))
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sliderContainer, { transform: [{ translateX: slideAnim }] }]}>
        {/* LOGIN SCREEN */}
        <View style={styles.screen}>
          <Text style={styles.title}>Login</Text>

          <TextInput placeholder="Email" placeholderTextColor="#999" style={styles.input} onChangeText={setLoginEmail} value={loginEmail} />

          <TextInput placeholder="Password" placeholderTextColor="#999" secureTextEntry style={styles.input} onChangeText={setLoginPassword} value={loginPassword} />

          <TouchableOpacity onPress={slideToForgotReset}>
            <Text style={styles.switchText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={slideToRegister}>
            <Text style={styles.switchText}>Don’t have account? Register</Text>
          </TouchableOpacity>
        </View>

        {/* REGISTER SCREEN */}
        <View style={styles.screen}>
          <Text style={styles.title}>Register</Text>

          <TextInput placeholder="Username" placeholderTextColor="#999" style={styles.input} onChangeText={setRegUsername} value={regUsername} />

          <TextInput placeholder="E-mail" placeholderTextColor="#999" style={styles.input} onChangeText={setRegEmail} value={regEmail} />

          <TextInput placeholder="Password" placeholderTextColor="#999" secureTextEntry style={styles.input} onChangeText={setRegPassword} value={regPassword} />

          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={roles}
              labelField="label"
              valueField="value"
              placeholder="Select Role"
              value={role}
              onChange={(item) => setRole(item.value)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={slideToLogin}>
            <Text style={styles.switchText}>Already have account? Login</Text>
          </TouchableOpacity>
        </View>

        {/* FORGOT PASSWORD SCREEN */}
        <View style={styles.screen}>
          <Text style={styles.title}>Forgot Password</Text>

          <TextInput placeholder="Email" style={styles.input} onChangeText={setForgotEmail} value={forgotEmail} />

          <TextInput placeholder="Name" style={styles.input} onChangeText={setForgotName} value={forgotName} />

          <TextInput placeholder="New Password" secureTextEntry style={styles.input} onChangeText={setNewPassword} value={newPassword} />

          <TouchableOpacity style={styles.button} onPress={handleForgot}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={slideBackFromForgot}>
            <Text style={styles.switchText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", justifyContent: "center" },
  sliderContainer: { flexDirection: "row", width: width * 3 },
  screen: { width: width, padding: 25, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 14, marginBottom: 15, fontSize: 16, elevation: 3 },
  dropdownContainer: { marginBottom: 15 },
  dropdown: { height: 55, backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 15 },
  placeholderStyle: { fontSize: 16, color: "#999" },
  selectedTextStyle: { fontSize: 16, color: "#000" },
  button: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 14, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  switchText: { textAlign: "center", marginTop: 20, color: "#4A90E2", fontWeight: "600" },
});
