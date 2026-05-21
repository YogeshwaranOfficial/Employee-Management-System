import jwt, { Secret, SignOptions } from "jsonwebtoken";

// Ensure env variable exists
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const SECRET: Secret = process.env.JWT_SECRET;

type Role = "ADMIN" | "EMPLOYEE";

type JwtPayload = {
  id: number;
  role: Role;
};

// GENERATE TOKEN
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, SECRET, options);
};

// VERIFY TOKEN
export const verifyTokenUtil = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};