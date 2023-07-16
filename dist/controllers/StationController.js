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
exports.updateStationsTable = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../database");
const node_cron_1 = __importDefault(require("node-cron"));
function fetchStationsFromAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = "0755767fea34480e5e7bd38aad7b7468972dcc7c";
        const apiUrl = `https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=${apiKey}`;
        try {
            const response = yield axios_1.default.get(apiUrl);
            return response.data.map((station) => ({
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
        }
        catch (error) {
            console.error("Error fetching stations from API:", error);
            throw error;
        }
    });
}
function updateStationsTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stations = yield fetchStationsFromAPI();
            const dbConnection = yield (0, database_1.getDBConnection)();
            yield dbConnection.query("DELETE FROM favorites WHERE station_id IN (SELECT station_id FROM stations)");
            // Supprimer toutes les entrées de la table stations
            yield dbConnection.query("DELETE FROM stations");
            // Insérer les nouvelles données des stations dans la table
            for (const station of stations) {
                const query = "INSERT INTO stations (station_id, station_name, station_address, station_latitude, station_longitude, station_banking, station_status, station_availabilities_bikes, station_availabilities_stands, station_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
                yield dbConnection.query(query, values);
            }
            console.log("Stations table updated successfully");
        }
        catch (error) {
            console.error("Error updating stations table:", error);
        }
    });
}
exports.updateStationsTable = updateStationsTable;
// Tâche planifiée pour mettre à jour la table toutes les 10 minutes
const updateStationsJob = node_cron_1.default.schedule("*/10 * * * *", updateStationsTable);
// Démarrer la tâche planifiée
updateStationsJob.start();
// Appeler la fonction pour effectuer la première mise à jour
updateStationsTable();
