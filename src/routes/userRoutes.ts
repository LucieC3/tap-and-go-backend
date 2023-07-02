import { Router } from "express";
import {
  createUserHandler,
  loginUser,
  getUserProfileHandler,
  authenticateToken,
  logoutUser,
} from "../controllers/UserController";
import {
  addFavorite,
  removeFavorite,
  getAllFavorites,
} from "../controllers/FavoriteController";

const router = Router();

// Route pour créer un utilisateur
router.post("/register", createUserHandler);

// Route pour se connecter
router.post("/login", loginUser);

// Route pour se déconnecter
router.get("/logout", authenticateToken, logoutUser);

// Route pour obtenir le profil de l'utilisateur
router.get("/profile", authenticateToken, getUserProfileHandler);

// Route pour ajouter une station aux favoris de l'utilisateur
router.post("/favorites/:stationId", authenticateToken, addFavorite);

// Route pour supprimer une station des favoris de l'utilisateur
router.delete("/favorites/:favoriteId", authenticateToken, removeFavorite);

// Route pour obtenir les favoris de l'utilisateur
router.get("/favorites", authenticateToken, getAllFavorites);

export default router;
