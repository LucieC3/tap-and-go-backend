"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFavorites = exports.removeFavorite = exports.addFavorite = void 0;
const database_1 = require("../database");
function addFavorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stationId = parseInt(req.params.stationId);
            const userId = req.userId;
            const dbConnection = yield (0, database_1.getDBConnection)();
            // Vérifier si le favori existe déjà pour l'utilisateur
            const [existingFavorite] = yield dbConnection.query("SELECT * FROM favorites WHERE station_id = ? AND user_id = ?", [stationId, userId]);
            if (Array.isArray(existingFavorite) && existingFavorite.length > 0) {
                res.status(400).json({ error: "Favorite already exists" });
                return;
            }
            // Ajouter le favori dans la table
            yield dbConnection.query("INSERT INTO favorites (favorite_id, station_id, user_id) VALUES (NULL, ?, ?)", [stationId, userId]);
            res.status(201).json({ message: "Favorite added" });
        }
        catch (error) {
            console.error("Error adding favorite:", error);
            res.status(500).json({ error: "Error adding favorite" });
        }
    });
}
exports.addFavorite = addFavorite;
function removeFavorite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const favoriteId = parseInt(req.params.favoriteId);
            const userId = req.userId;
            const dbConnection = yield (0, database_1.getDBConnection)();
            // Vérifier si le favori appartient à l'utilisateur
            const [existingFavorite] = yield dbConnection.query("SELECT * FROM favorites WHERE favorite_id = ? AND user_id = ?", [favoriteId, userId]);
            if (!Array.isArray(existingFavorite) || existingFavorite.length === 0) {
                res.status(400).json({ error: "Favorite not found" });
                return;
            }
            // Supprimer le favori de la table
            yield dbConnection.query("DELETE FROM favorites WHERE favorite_id = ?", [
                favoriteId,
            ]);
            res.status(200).json({ message: "Favorite removed" });
        }
        catch (error) {
            console.error("Error removing favorite:", error);
            res.status(500).json({ error: "Error removing favorite" });
        }
    });
}
exports.removeFavorite = removeFavorite;
function getAllFavorites(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const dbConnection = yield (0, database_1.getDBConnection)();
            // Récupérer tous les favoris de l'utilisateur depuis la table
            const [favorites] = yield dbConnection.query("SELECT * FROM favorites WHERE user_id = ?", [userId]);
            res.status(200).json({ favorites });
        }
        catch (error) {
            console.error("Error retrieving favorites:", error);
            res.status(500).json({ error: "Error retrieving favorites" });
        }
    });
}
exports.getAllFavorites = getAllFavorites;
