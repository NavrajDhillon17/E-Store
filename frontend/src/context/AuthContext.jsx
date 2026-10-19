import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("novastore_token"));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem("novastore_token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.removeItem("novastore_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem("novastore_token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);

      addToast(`Welcome back, ${receivedUser.name}!`, "success");
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      addToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem("novastore_token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);

      addToast("Account created successfully!", "success");
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      addToast(msg, "error");
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("novastore_token");
    setToken(null);
    setUser(null);
    addToast("Signed out successfully", "info");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
