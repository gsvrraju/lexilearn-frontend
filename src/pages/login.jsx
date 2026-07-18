import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/login-bg.jpg";

const API_BASE = "http://127.0.0.1:8000";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter Email and Password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data);

      if (!data.success) {
        alert(data.message || "Login Failed");
        return;
      }

      // Backend returns user object
      const user = data.user;

      // Save complete user object
      localStorage.setItem("user", JSON.stringify(user));

      // Save individual fields
      localStorage.setItem("user_id", user.user_id);
      localStorage.setItem("full_name", user.full_name);
      localStorage.setItem("email", user.email);

      alert(`Welcome ${user.full_name} 👋`);

      navigate("/dashboard");

    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message || "Login Failed");
      } else {
        alert("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.50)), url(${bgImage})`,
      }}
    >
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back 👋</h1>

        <p style={styles.subtitle}>
          Login to continue your English learning journey.
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          New User?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,.12)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,.3)",
    textAlign: "center",
    color: "#fff",
  },

  title: {
    marginBottom: "10px",
    fontSize: "32px",
  },

  subtitle: {
    marginBottom: "30px",
    color: "#ddd",
    lineHeight: "1.5",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#c48b96",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  text: {
    marginTop: "20px",
    color: "#eee",
  },

  link: {
    color: "#c48b96",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default LoginPage;