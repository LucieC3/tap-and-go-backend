import axios from "axios";
import { Connection } from "mysql2/promise";
import { getDBConnection } from "../database";
import { Station } from "../models/Station";

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

async function insertStationToDatabase(station: Station): Promise<void> {
  try {
    const dbConnection: Connection = await getDBConnection();

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
    console.log("Station inserted successfully");
  } catch (error) {
    console.error("Error inserting station to database:", error);
    throw error;
  }
}

async function insertStationsToDatabase(stations: Station[]): Promise<void> {
  try {
    for (const station of stations) {
      await insertStationToDatabase(station);
    }
    console.log("Stations inserted successfully");
  } catch (error) {
    console.error("Error inserting stations to database:", error);
    throw error;
  }
}

// Fonction principale pour récupérer les stations de l'API et les insérer dans la base de données
export async function populateStationsTable(): Promise<void> {
  try {
    const stations = await fetchStationsFromAPI();
    await insertStationsToDatabase(stations);
  } catch (error) {
    console.error("Error populating stations table:", error);
  }
}

// Appeler la fonction pour lancer le processus de peuplement de la table
populateStationsTable();
