import { Request, Response } from "express";
import { Connection } from "mysql2/promise";
import { getDBConnection } from "../database";
import { Favorite } from "../models/Favorite";

interface CustomRequest extends Request {
  userId?: number;
}

export async function addFavorite(
  req: CustomRequest,
  res: Response
): Promise<void> {
  try {
    const stationId: number = parseInt(req.params.stationId);
    const userId: number = req.userId;

    const dbConnection: Connection = await getDBConnection();

    // Vérifier si le favori existe déjà pour l'utilisateur
    const [existingFavorite] = await dbConnection.query<Favorite[]>(
      "SELECT * FROM favorites WHERE station_id = ? AND user_id = ?",
      [stationId, userId]
    );

    if (Array.isArray(existingFavorite) && existingFavorite.length > 0) {
      res.status(400).json({ error: "Favorite already exists" });
      return;
    }

    // Ajouter le favori dans la table
    await dbConnection.query(
      "INSERT INTO favorites (station_id, user_id) VALUES (?, ?)",
      [stationId, userId]
    );

    res.status(201).json({ message: "Favorite added" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Error adding favorite" });
  }
}

export async function removeFavorite(
  req: CustomRequest,
  res: Response
): Promise<void> {
  try {
    const favoriteId: number = parseInt(req.params.favoriteId);
    const userId: number = req.userId;

    const dbConnection: Connection = await getDBConnection();

    // Vérifier si le favori appartient à l'utilisateur
    const [existingFavorite] = await dbConnection.query<Favorite[]>(
      "SELECT * FROM favorites WHERE favorite_id = ? AND user_id = ?",
      [favoriteId, userId]
    );

    if (!Array.isArray(existingFavorite) || existingFavorite.length === 0) {
      res.status(400).json({ error: "Favorite not found" });
      return;
    }

    // Supprimer le favori de la table
    await dbConnection.query("DELETE FROM favorites WHERE favorite_id = ?", [
      favoriteId,
    ]);

    res.status(200).json({ message: "Favorite removed" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Error removing favorite" });
  }
}

export async function getAllFavorites(
  req: CustomRequest,
  res: Response
): Promise<void> {
  try {
    const userId: number = req.userId;

    const dbConnection: Connection = await getDBConnection();

    // Récupérer tous les favoris de l'utilisateur depuis la table
    const [favorites] = await dbConnection.query<Favorite[]>(
      "SELECT * FROM favorites WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Error retrieving favorites" });
  }
}
