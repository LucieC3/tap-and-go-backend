import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Connection } from "mysql2/promise";
import { getDBConnection } from "../database";
import { User } from "../models/User";

interface CustomRequest extends Request {
  userId?: number;
}

export async function getUserFromDatabase(
  userId: number
): Promise<User | null> {
  const dbConnection: Connection = await getDBConnection();
  const [rows] = await dbConnection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId]
  );
  const userRow: User[] = rows as User[];

  if (userRow.length === 0) {
    return null;
  }

  const user = userRow[0];
  delete user.password; // Supprime le mot de passe du résultat

  return user;
}

const getUserProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      userId: number;
    };

    const userId = decoded.userId;

    // Récupération des informations du profil de l'utilisateur depuis la base de données
    const userProfile = await getUserFromDatabase(userId);

    if (!userProfile) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ userProfile });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Error retrieving user profile" });
  }
};

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: () => void
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      userId: number;
    };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export { getUserProfile };
