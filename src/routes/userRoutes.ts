import { Router } from "express";
import {
  createUserHandler,
  loginUser,
  getUserProfileHandler,
  authenticateToken,
} from "../controllers/UserController";

const router = Router();

// Route pour créer un utilisateur
router.post("/register", createUserHandler);

// Route pour se connecter
router.post("/login", loginUser);

// Route pour obtenir le profil de l'utilisateur
router.get("/profile", authenticateToken, getUserProfileHandler);

export default router;
