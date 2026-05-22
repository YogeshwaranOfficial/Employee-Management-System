import { useState, type ReactNode } from "react";

import AuthContext, {
  type User,
} from "./AuthContext";

import { removeToken } from "../utils/token";

const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const logout = () => {
    removeToken();

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;