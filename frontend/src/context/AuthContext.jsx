import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    username: null,
    token: null,
    role: null,
    userId: null
  });

  useEffect(() => {
    // au chargement : relire les infos du localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token && username) {
      setAuth({ token, username, role, userId });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userId", data.userId);

    setAuth(data);
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ username: null, token: null, role: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook d'accès
export function useAuth() {
  return useContext(AuthContext);
}
