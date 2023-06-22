import { Router } from "express";
import { createUserHandler } from "../controllers/UserController";

const router = Router();

router.post("/users", createUserHandler);

export default router;
