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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.authenticateToken = exports.getUserFromDatabase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
function getUserFromDatabase(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remplacez cet exemple avec votre propre logique pour récupérer les informations de l'utilisateur à partir de la base de données
        const dbConnection = yield (0, database_1.getDBConnection)();
        const [rows] = yield dbConnection.query("SELECT * FROM users WHERE user_id = ?", [userId]);
        const userRow = rows;
        if (userRow.length === 0) {
            return null;
        }
        const user = userRow[0];
        delete user.password; // Supprime le mot de passe du résultat
        return user;
    });
}
exports.getUserFromDatabase = getUserFromDatabase;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;
        // Récupération des informations du profil de l'utilisateur depuis la base de données
        const userProfile = yield getUserFromDatabase(userId);
        if (!userProfile) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ userProfile });
    }
    catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: "Error retrieving user profile" });
    }
});
exports.getUserProfile = getUserProfile;
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ error: "Invalid token" });
    }
}
exports.authenticateToken = authenticateToken;
