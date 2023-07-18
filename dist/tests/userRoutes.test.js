var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require("supertest");
const app = require("../app");
describe("User Routes", () => {
    let authToken;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        // Connexion de l'utilisateur pour obtenir un jeton d'authentification
        const response = yield request(app)
            .post("/api/login")
            .send({ email: "user@example.com", password: "password123" })
            .expect(200);
        authToken = response.body.token;
    }));
    it("should create a new user", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/api/users")
            .send({
            username: "new_user",
            password: "password123",
            email: "newuser@example.com",
        })
            .expect(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("message", "Utilisateur créé avec succès");
    }));
    it("should return an error for invalid credentials during login", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/api/login")
            .send({ email: "user@example.com", password: "incorrect_password" })
            .expect(401);
        expect(response.body).toHaveProperty("message", "Mot de passe incorrect");
    }));
    it("should return the user profile", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty("userProfile");
        // Assurez-vous que la réponse contient les détails du profil de l'utilisateur
        expect(response.body.userProfile).toHaveProperty("username", "user1");
        expect(response.body.userProfile).toHaveProperty("email", "user@example.com");
    }));
    it("should return an error if the user profile is not found", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(404);
        expect(response.body).toHaveProperty("error", "User not found");
    }));
    it("should log out the user", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/api/logout")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty("message", "Déconnexion réussie");
    }));
});
