import { Router } from "express";
import {
  createUserHandler,
  loginUser,
  getUserProfileHandler,
  authenticateToken,
  logoutUser,
} from "../controllers/UserController";
import { FavoriteController } from "../controllers/FavoriteController";

const router = Router();

// Route pour créer un utilisateur
router.post("/register", createUserHandler);

// Route pour se connecter
router.post("/login", loginUser);

// Route pour se déconnecter
router.get("/logout", authenticateToken, logoutUser);

// Route pour obtenir le profil de l'utilisateur
router.get("/profile", authenticateToken, getUserProfileHandler);

// Route pour obtenir tous les favoris
router.get("/favorites", authenticateToken, FavoriteController.getAllFavorites);

// Route pour ajouter un favori
router.post("/favorites", authenticateToken, FavoriteController.addFavorite);

// Route pour supprimer un favori
router.delete(
  "/favorites/:favoriteId",
  authenticateToken,
  FavoriteController.removeFavorite
);

export default router;
