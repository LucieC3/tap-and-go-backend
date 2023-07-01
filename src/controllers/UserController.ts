import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Connection } from "mysql2/promise";
import { getDBConnection } from "../database";
import { User } from "../models/User";

const createUser = async (
  connection: Connection,
  user: User
): Promise<number> => {
  const { username, password, email } = user;

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Requête SQL pour insérer un nouvel utilisateur
  const query =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  const values = [username, hashedPassword, email];

  // Exécution de la requête
  const [result] = await connection.query(query, values);

  // Récupération de l'ID de l'utilisateur créé
  const userId = (result as any).insertId;

  return userId;
};

export const createUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, email } = req.body;
    const user: User = { username, password, email };

    const dbConnection: Connection = await getDBConnection();
    const userId: number = await createUser(dbConnection, user);

    res
      .status(201)
      .json({ id: userId, message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérification des informations d'identification
    const dbConnection: Connection = await getDBConnection();
    const [userRow] = await dbConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user: User = userRow[0];

    if (!user) {
      res.status(401).json({ message: "Email incorrect" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }

    // Génération du JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la connexion de l'utilisateur" });
  }
};

export { createUser, loginUser };
