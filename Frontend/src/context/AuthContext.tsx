import { createContext } from "react";

export type Role = "ADMIN" | "EMPLOYEE";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  imageUrl?: string;
  employeeId?: string;
  department?: string;
};

export type AuthType = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthType | undefined>(
  undefined
);

export default AuthContext;