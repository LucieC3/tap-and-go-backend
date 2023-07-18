"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const FavoriteController_1 = require("../controllers/FavoriteController");
const router = (0, express_1.Router)();
// Route pour créer un utilisateur
router.post("/register", UserController_1.createUserHandler);
// Route pour se connecter
router.post("/login", UserController_1.loginUser);
// Route pour se déconnecter
router.get("/logout", UserController_1.authenticateToken, UserController_1.logoutUser);
// Route pour obtenir le profil de l'utilisateur
router.get("/profile", UserController_1.authenticateToken, UserController_1.getUserProfileHandler);
// Route pour ajouter une station aux favoris de l'utilisateur
router.post("/favorites/:stationId", UserController_1.authenticateToken, FavoriteController_1.addFavorite);
// Route pour supprimer une station des favoris de l'utilisateur
router.delete("/favorites/:favoriteId", UserController_1.authenticateToken, FavoriteController_1.removeFavorite);
// Route pour obtenir les favoris de l'utilisateur
router.get("/favorites", UserController_1.authenticateToken, FavoriteController_1.getAllFavorites);
exports.default = router;
