import axios from "axios";
import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { getDBConnection } from "../database";
import { Station } from "../models/Station";
import cron from "node-cron";

async function fetchStationsFromAPI(): Promise<Station[]> {
  const apiKey = "0755767fea34480e5e7bd38aad7b7468972dcc7c";
  const apiUrl = `https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.map((station: any) => ({
      station_id: station.number,
      station_name: station.name,
      station_address: station.address,
      station_latitude: station.position.lat,
      station_longitude: station.position.lng,
      station_banking: station.banking,
      station_status: station.status,
      station_availabilities_bikes: station.available_bikes,
      station_availabilities_stands: station.available_bike_stands,
      station_capacity: station.capacity,
    }));
  } catch (error) {
    console.error("Error fetching stations from API:", error);
    throw error;
  }
}

export async function updateStationsTable(): Promise<void> {
  try {
    const stations = await fetchStationsFromAPI();
    const dbConnection: Connection = await getDBConnection();

    for (const station of stations) {
      const query =
        "INSERT INTO stations (station_id, station_name, station_address, station_latitude, station_longitude, station_banking, station_status, station_availabilities_bikes, station_availabilities_stands, station_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE station_name = VALUES(station_name), station_address = VALUES(station_address), station_latitude = VALUES(station_latitude), station_longitude = VALUES(station_longitude), station_banking = VALUES(station_banking), station_status = VALUES(station_status), station_availabilities_bikes = VALUES(station_availabilities_bikes), station_availabilities_stands = VALUES(station_availabilities_stands), station_capacity = VALUES(station_capacity)";

      const values = [
        station.station_id,
        station.station_name,
        station.station_address,
        station.station_latitude,
        station.station_longitude,
        station.station_banking,
        station.station_status,
        station.station_availabilities_bikes,
        station.station_availabilities_stands,
        station.station_capacity,
      ];

      await dbConnection.query(query, values);
    }

    console.log("Stations table updated successfully");
  } catch (error) {
    console.error("Error updating stations table:", error);
  }
}

export async function getStations(req: Request, res: Response): Promise<void> {
  try {
    const stationId = req.params.id as string;
    const stationIds = stationId.split(",").map(Number);

    const dbConnection: Connection = await getDBConnection();

    const [stations] = await dbConnection.query<Station[]>(
      `SELECT * FROM stations WHERE station_id IN (?)`,
      [stationIds]
    );

    res.status(200).json({ stations });
  } catch (error) {
    console.error("Error retrieving stations:", error);
    res.status(500).json({ error: "Error retrieving stations" });
  }
}

// Tâche planifiée pour mettre à jour la table toutes les 10 minutes
const updateStationsJob = cron.schedule("*/10 * * * *", updateStationsTable);

// Démarrer la tâche planifiée
updateStationsJob.start();

// Appeler la fonction pour effectuer la première mise à jour
updateStationsTable();
