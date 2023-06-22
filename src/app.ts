import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectToDB } from "./database";
import { createUserHandler } from "./controllers/UserController";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(express.json());

connectToDB().then(() => {
  console.log("Connection succeed");

  app.post("/users", createUserHandler);

  app.use("/api", userRoutes);

  app.listen(3001, () => {
    console.log("Serveur started : port 3001");
  });
});
