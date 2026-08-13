import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ API_URL }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!API_URL) {
      setError("Backend API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("REGISTER STATUS:", response.status);
      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Registration failed."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      if (
        err.name === "TypeError" &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Cannot connect to the server. Make sure your backend is running and the API URL is correct."
        );
      } else {
        setError(
          err.message || "Unable to create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.iconCircle}>
          <div style={styles.userIcon}>👤</div>
        </div>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Create your ExpenseTracker account
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div style={styles.field}>
            <label style={styles.label}>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={styles.input}
              required
            />
          </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={styles.passwordInput}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                style={styles.showButton}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={styles.field}>
            <label style={styles.label}>
              Confirm Password
            </label>

            <div style={styles.passwordWrapper}>
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                style={styles.passwordInput}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                style={styles.showButton}
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}

          <span
            style={styles.loginLink}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

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
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px",
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

  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 65px 14px 15px",
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
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#008f89",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    padding: "5px",
  },

  error: {
    background:
      "rgba(255, 50, 50, 0.25)",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  success: {
    background:
      "rgba(0, 255, 150, 0.2)",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#008f89",
    fontSize: "16px",
    fontWeight: "700",
  },

  loginText: {
    marginTop: "25px",
    marginBottom: "0",
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px",
  },

  loginLink: {
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;