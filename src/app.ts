import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./database";
import userRoutes from "./routes/userRoutes";
import { populateStationsTable } from "./controllers/StationController";

dotenv.config();

const app = express();
const cors = require("cors");

app.use(express.json());

connectToDB()
  .then(() => {
    console.log("Connection to the database succeeded");

    // Appeler la fonction pour peupler la table des stations
    populateStationsTable().then(() => {
      console.log("Stations table populated");

      app.use(
        cors({
          origin: "http://localhost:3000",
          credentials: true,
        })
      );

      app.use("/api", userRoutes);

      app.listen(3001, () => {
        console.log("Server started on port 3001");
      });
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
