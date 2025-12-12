import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/Auth.css";
import { authFetch } from "../utils/authFetch";
import { API_BASE } from "../utils/config";
import { useLoader } from "../dashboard/LoaderContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 🔑 Step 1 — Login request
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for cookies
        body: JSON.stringify({
          email,        // backend supports email or username
          password,
        }),
      });

      // ❌ Login failed
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.detail || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // ✅ Successful login
      const data = await res.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // 🔎 Step 2 — Fetch profile using authFetch
      const meRes = await authFetch(`/api/auth/me/`);
      if (meRes.ok) {
        const profile = await meRes.json();
        console.log("Logged-in user:", profile);
      }

      // 🚀 Step 3 — Redirect user
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Login</h2>

      {errorMsg && <p className="error-box">❌ {errorMsg}</p>}

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit" className="auth-btn">Login</button>
      </form>

      <div className="auth-footer">
        <a href="/register">Register</a>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </motion.div>
  );
}

export default Login;
