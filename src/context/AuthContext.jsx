import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "https://altius-assignment-backend-s6ct.onrender.com/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(
      "https://altius-assignment-backend-s6ct.onrender.com/api/auth/login",
      {
        email,
        password,
      }
    );
    const { token } = response.data;
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const register = async (name, email, password) => {
    const response = await axios.post(
      "https://altius-assignment-backend-s6ct.onrender.com/api/auth/register",
      {
        name,
        email,
        password,
      }
    );
    const { token } = response.data;
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
