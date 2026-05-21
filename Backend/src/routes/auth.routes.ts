import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;