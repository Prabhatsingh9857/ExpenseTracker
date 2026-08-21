import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({
  onLogin,
  API_URL = "https://expense-tracker-backend-9t99.onrender.com",
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  // Remember me
  const [remember, setRemember] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  // Error
  const [error, setError] = useState("");

  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/user/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      // Safely read response
      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("LOGIN RESPONSE:", data);

      // ==================================================
      // SERVER ERROR
      // ==================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Login failed (${response.status}).`
        );
      }

      // ==================================================
      // GET TOKEN
      // ==================================================

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token;

      // ==================================================
      // GET USER
      // ==================================================

      const user =
        data.user ||
        data.data?.user ||
        data.data ||
        null;

      console.log("LOGIN USER:", user);
      console.log("LOGIN TOKEN:", token);

      // ==================================================
      // TOKEN CHECK
      // ==================================================

      if (!token) {
        throw new Error(
          "Login successful, but no authentication token was returned by the server."
        );
      }

      // ==================================================
      // SEND AUTH DATA TO APP.JSX
      // ==================================================

      if (onLogin) {
        onLogin(
          user,
          remember,
          token
        );
      } else {
        // Fallback in case onLogin is not provided
        const storage = remember
          ? localStorage
          : sessionStorage;

        storage.setItem(
          "token",
          token
        );

        if (user) {
          storage.setItem(
            "user",
            JSON.stringify(user)
          );
        }

        navigate("/");
      }

    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      // Network / server connection error
      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Cannot connect to the server. Please check your internet connection and try again."
        );
      } else {
        setError(
          err.message ||
            "Unable to login. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const handleRegister = () => {
    navigate("/signup");
  };

  // ======================================================
  // FORGOT PASSWORD
  // ======================================================

  const handleForgotPassword = () => {
    alert(
      "Forgot password functionality will be added soon."
    );
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* USER ICON */}

        <div style={styles.iconCircle}>
          <div style={styles.userIcon}>
            👤
          </div>
        </div>

        {/* HEADING */}

        <h1 style={styles.title}>
          Welcome Back
        </h1>

        <p style={styles.subtitle}>
          Sign in to your ExpenseTracker account
        </p>

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div style={styles.field}>

            <label style={styles.label}>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={styles.input}
              required
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}

          <div style={styles.field}>

            <label style={styles.label}>
              Password
            </label>

            <div style={styles.passwordWrapper}>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={styles.passwordInput}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={styles.showButton}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* REMEMBER + FORGOT */}

          <div style={styles.rememberRow}>

            <label
              style={styles.rememberLabel}
            >

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(
                    e.target.checked
                  )
                }
              />

              <span>
                {" "}
                Remember me
              </span>

            </label>

            <button
              type="button"
              onClick={
                handleForgotPassword
              }
              style={styles.forgot}
            >
              Forgot password?
            </button>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity:
                loading ? 0.7 : 1,
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <p style={styles.register}>

          Don't have an account?{" "}

          <button
            type="button"
            onClick={handleRegister}
            style={styles.registerLink}
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background:
      "linear-gradient(135deg, #d9f5f2, #f4fbfa)",

    padding: "20px",

    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",

    padding: "40px",

    boxSizing: "border-box",

    borderRadius: "24px",

    background:
      "linear-gradient(145deg, #009e98, #00b5ad)",

    boxShadow:
      "0 20px 50px rgba(0, 120, 115, 0.25)",

    textAlign: "center",
  },

  iconCircle: {
    width: "70px",
    height: "70px",

    margin: "0 auto 18px",

    borderRadius: "50%",

    background:
      "rgba(255,255,255,0.18)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  userIcon: {
    fontSize: "32px",
  },

  title: {
    margin: "0",

    color: "#ffffff",

    fontSize: "30px",

    fontWeight: "700",
  },

  subtitle: {
    margin: "10px 0 28px",

    color:
      "rgba(255,255,255,0.85)",

    fontSize: "14px",
  },

  error: {
    background:
      "rgba(255, 50, 50, 0.25)",

    color: "#ffffff",

    padding: "10px",

    borderRadius: "8px",

    marginBottom: "18px",

    fontSize: "14px",

    lineHeight: "1.5",
  },

  field: {
    marginBottom: "18px",

    textAlign: "left",
  },

  label: {
    display: "block",

    marginBottom: "7px",

    color: "#ffffff",

    fontSize: "14px",

    fontWeight: "600",
  },

  input: {
    width: "100%",

    boxSizing: "border-box",

    padding: "14px 15px",

    border: "none",

    borderRadius: "10px",

    outline: "none",

    fontSize: "15px",

    background: "#ffffff",

    color: "#222",
  },

  // ====================================================
  // PASSWORD
  // ====================================================

  passwordWrapper: {
    position: "relative",

    width: "100%",
  },

  passwordInput: {
    width: "100%",

    boxSizing: "border-box",

    padding:
      "14px 65px 14px 15px",

    border: "none",

    borderRadius: "10px",

    outline: "none",

    fontSize: "15px",

    background: "#ffffff",

    color: "#222",
  },

  showButton: {
    position: "absolute",

    right: "10px",

    top: "50%",

    transform:
      "translateY(-50%)",

    border: "none",

    background: "transparent",

    color: "#008f89",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    padding: "5px",
  },

  // ====================================================
  // REMEMBER
  // ====================================================

  rememberRow: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "20px",

    fontSize: "13px",

    color: "#ffffff",

    gap: "10px",
  },

  rememberLabel: {
    display: "flex",

    alignItems: "center",

    cursor: "pointer",

    whiteSpace: "nowrap",
  },

  forgot: {
    border: "none",

    background: "transparent",

    color: "#ffffff",

    cursor: "pointer",

    textDecoration:
      "underline",

    fontSize: "13px",

    padding: 0,
  },

  // ====================================================
  // LOGIN BUTTON
  // ====================================================

  button: {
    width: "100%",

    padding: "14px",

    border: "none",

    borderRadius: "10px",

    background: "#ffffff",

    color: "#008f89",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",
  },

  // ====================================================
  // REGISTER
  // ====================================================

  register: {
    marginTop: "25px",

    marginBottom: "0",

    color:
      "rgba(255,255,255,0.85)",

    fontSize: "14px",
  },

  registerLink: {
    border: "none",

    background: "transparent",

    color: "#ffffff",

    fontWeight: "700",

    cursor: "pointer",

    textDecoration:
      "underline",

    fontSize: "14px",

    padding: 0,
  },
};

export default Login;