import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    username: null,
    token: null,
    role: null,
    userId: null,
    avatar: null
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const avatar = localStorage.getItem("avatar");

    if (token && username) {
      setAuth({ token, username, role, userId, avatar });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("avatar", data.avatar || "");

    setAuth(data);
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ username: null, token: null, role: null, userId: null, avatar: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
