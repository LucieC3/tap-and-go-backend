import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./database";
import { createUserHandler, loginUser } from "./controllers/UserController";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const cors = require("cors");

app.use(express.json());

connectToDB().then(() => {
  console.log("Connection succeed");

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.post("/users", createUserHandler);
  app.post("/register", createUserHandler);
  app.post("/login", loginUser);

  app.use("/api", userRoutes);

  app.listen(3001, () => {
    console.log("Serveur started : port 3001");
  });
});
