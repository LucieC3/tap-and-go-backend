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
    console.log(response.data);
    return response.data.map((station: any) => ({
      stationId: station.number,
      name: station.name,
      address: station.address,
      position: {
        latitude: station.position.lat,
        longitude: station.position.lng,
      },
      banking: station.banking,
      status: station.status,
      totalStands: {
        availabilities: {
          bikes: station.available_bikes,
          stands: station.available_bike_stands,
        },
        capacity: station.capacity,
      },
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

    await dbConnection.query(
      "DELETE FROM favorites WHERE station_id IN (SELECT station_id FROM stations)"
    );
    // Supprimer toutes les entrées de la table stations
    await dbConnection.query("DELETE FROM stations");

    // Insérer les nouvelles données des stations dans la table
    for (const station of stations) {
      const query =
        "INSERT INTO stations (station_id, station_name, station_address, station_latitude, station_longitude, station_banking, station_status, station_availabilities_bikes, station_availabilities_stands, station_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        station.stationId,
        station.name,
        station.address,
        station.position.latitude,
        station.position.longitude,
        station.banking,
        station.status,
        station.totalStands.availabilities.bikes,
        station.totalStands.availabilities.stands,
        station.totalStands.capacity,
      ];

      await dbConnection.query(query, values);
    }

    console.log("Stations table updated successfully");
  } catch (error) {
    console.error("Error updating stations table:", error);
  }
}

// Tâche planifiée pour mettre à jour la table toutes les 10 minutes
const updateStationsJob = cron.schedule("*/10 * * * *", updateStationsTable);

// Démarrer la tâche planifiée
updateStationsJob.start();

// Appeler la fonction pour effectuer la première mise à jour
updateStationsTable();
