import { Request, Response } from "express";
import { Connection } from "mysql2/promise";
import connection from "../database";
import { createUser, User } from "../models/User";

export const createUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, email } = req.body;
    const user: User = { username, password, email };

    const dbConnection: Connection = await connection;
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
