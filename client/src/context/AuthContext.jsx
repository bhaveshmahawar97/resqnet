/* eslint-disable react-refresh/only-export-components -- AuthContext intentionally exports both provider and hook */
/* eslint-disable react-hooks/set-state-in-effect -- context init pattern */
import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

export const ROLES = {
  user: "user",
  ngo: "ngo",
  volunteer: "volunteer",
  admin: "admin",
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  // =========================
  // REGISTER
  // =========================
  const register = async (formData) => {
    try {
      const { data } = await api.post("/auth/register", formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setAuthToken(data.token);
      }

      setUser(data.user || null);

      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };



  // =========================
  // LOGIN
  // =========================
  const login = async (formData) => {
    try {
      const { data } = await api.post("/auth/login", formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setAuthToken(data.token);
      }

      setUser(data.user || null);

      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };



  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };



  // =========================
  // LOAD USER
  // =========================
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Ensure axios has header
      setAuthToken(token);

      const { data } = await api.get("/auth/me");

      setUser(data.user || null);
    } catch {
      localStorage.removeItem("token");
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadUser();

    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        // compatibility with existing UI
        signIn: login,
        signOut: logout,
        ROLES,
        isAuthenticated: !!user,
        email: user?.email || null,
        name: user?.name || user?.fullName || null,
        role: user?.role || null,
        isAdmin: user?.role === ROLES.admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  return useContext(AuthContext);
};
