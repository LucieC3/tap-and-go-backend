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
import { getStations } from "../controllers/StationController";

const router = Router();

router.post("/register", createUserHandler);
router.post("/login", loginUser);
router.get("/logout", authenticateToken, logoutUser);

router.get("/profile", authenticateToken, getUserProfileHandler);

router.get("/stations/:id", getStations);

router.get("/favorites", authenticateToken, getAllFavorites);
router.post("/favorites/:stationId", authenticateToken, addFavorite);
router.delete("/favorites/:favoriteId", authenticateToken, removeFavorite);
router.get("/favorites", authenticateToken, getAllFavorites);

export default router;
