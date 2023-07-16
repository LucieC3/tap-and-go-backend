import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./database";
import userRoutes from "./routes/userRoutes";
import { updateStationsTable } from "./controllers/StationController";

dotenv.config();

const app = express();
const cors = require("cors");
import cron from "node-cron";

app.use(express.json());

connectToDB()
  .then(() => {
    console.log("Connection to the database succeeded");

    const updateStationsJob = cron.schedule(
      "*/10 * * * *",
      updateStationsTable
    );

    updateStationsJob.start();

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
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

export default app;
