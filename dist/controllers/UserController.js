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
exports.authenticateToken = exports.getUserProfileHandler = exports.logoutUser = exports.loginUser = exports.createUser = exports.createUserHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const ProfileController_1 = require("../controllers/ProfileController");
Object.defineProperty(exports, "authenticateToken", { enumerable: true, get: function () { return ProfileController_1.authenticateToken; } });
const createUser = (connection, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = user;
    // Hash du mot de passe
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Requête SQL pour insérer un nouvel utilisateur
    const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const values = [username, hashedPassword, email];
    // Exécution de la requête
    const [result] = yield connection.query(query, values);
    console.log("Result of insertion:", result);
    // Récupération de l'ID de l'utilisateur créé
    const userId = result.insertId;
    return userId;
});
exports.createUser = createUser;
const createUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const user = { username, password, email };
        const dbConnection = yield (0, database_1.getDBConnection)();
        const userId = yield createUser(dbConnection, user);
        res
            .status(201)
            .json({ id: userId, message: "Utilisateur créé avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res
            .status(500)
            .json({ error: "Erreur lors de la création de l'utilisateur" });
    }
});
exports.createUserHandler = createUserHandler;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Vérification des informations d'identification
        const dbConnection = yield (0, database_1.getDBConnection)();
        const [userRow] = yield dbConnection.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = userRow[0];
        if (!user) {
            res.status(401).json({ message: "Email incorrect" });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }
        // Génération du JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur :", error);
        res
            .status(500)
            .json({ error: "Erreur lors de la connexion de l'utilisateur" });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    // Déconnexion de l'utilisateur
    req.userId = undefined;
    // Répondez avec un message de déconnexion réussie
    res.status(200).json({ message: "Déconnexion réussie" });
};
exports.logoutUser = logoutUser;
const getUserProfileHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const userProfile = yield (0, ProfileController_1.getUserFromDatabase)(userId);
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
exports.getUserProfileHandler = getUserProfileHandler;
