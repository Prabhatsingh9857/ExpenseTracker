import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";

// ======================================================
// PROTECTED ROUTE
// ======================================================

const ProtectedRoute = ({ user, token }) => {
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// ======================================================
// APP
// ======================================================

const App = () => {
  // ====================================================
  // USER
  // ====================================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("User loading error:", error);
      return null;
    }
  });

  // ====================================================
  // TOKEN
  // ====================================================

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      null
    );
  });

  // ====================================================
  // NAVIGATION
  // ====================================================

  const navigate = useNavigate();

  // ====================================================
  // SAVE LOGIN DATA
  // ====================================================

  const persistAuth = (
    userObj,
    tokenStr,
    remember = false
  ) => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

      if (remember) {
        if (userObj) {
          localStorage.setItem(
            "user",
            JSON.stringify(userObj)
          );
        }

        if (tokenStr) {
          localStorage.setItem(
            "token",
            tokenStr
          );
        }
      } else {
        if (userObj) {
          sessionStorage.setItem(
            "user",
            JSON.stringify(userObj)
          );
        }

        if (tokenStr) {
          sessionStorage.setItem(
            "token",
            tokenStr
          );
        }
      }

      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (error) {
      console.error(
        "persistAuth error:",
        error
      );
    }
  };

  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = (
    userData,
    remember,
    tokenFromApi
  ) => {
    persistAuth(
      userData,
      tokenFromApi,
      remember
    );

    navigate("/", {
      replace: true,
    });
  };

  // ====================================================
  // UPDATE USER PROFILE
  // ====================================================

  const updateUserData = (updatedUser) => {
    try {
      setUser(updatedUser);

      const userData =
        JSON.stringify(updatedUser);

      if (localStorage.getItem("token")) {
        localStorage.setItem(
          "user",
          userData
        );
      } else {
        sessionStorage.setItem(
          "user",
          userData
        );
      }
    } catch (error) {
      console.error(
        "Update user error:",
        error
      );
    }
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);

    navigate("/login", {
      replace: true,
    });
  };

  // ====================================================
  // ROUTES
  // ====================================================

  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLogin}
            API_URL="http://https://expense-tracker-backend-9t99.onrender.com"
          />
        }
      />

      {/* ================= SIGNUP ================= */}

      <Route
        path="/signup"
        element={
          <Signup
            API_URL="http://https://expense-tracker-backend-9t99.onrender.com"
          />
        }
      />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        element={
          <ProtectedRoute
            user={user}
            token={token}
          />
        }
      >

        {/* ================= LAYOUT ================= */}

        <Route
          element={
            <Layout
              user={user}
              token={token}
              onLogout={handleLogout}
            />
          }
        >

          {/* ================= DASHBOARD ================= */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* ================= INCOME ================= */}

          <Route
            path="/income"
            element={<Income />}
          />

          {/* ================= EXPENSE ================= */}

          <Route
            path="/expense"
            element={<Expense />}
          />

          {/* ================= PROFILE ================= */}

          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onUpdateProfile={updateUserData}
                onLogout={handleLogout}
              />
            }
          />

        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              user && token
                ? "/"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
};

export default App;