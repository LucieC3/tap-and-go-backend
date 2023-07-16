"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const StationController_1 = require("./controllers/StationController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const cors = require("cors");
const node_cron_1 = __importDefault(require("node-cron"));
app.use(express_1.default.json());
(0, database_1.connectToDB)()
    .then(() => {
    console.log("Connection to the database succeeded");
    const updateStationsJob = node_cron_1.default.schedule("*/10 * * * *", StationController_1.updateStationsTable);
    updateStationsJob.start();
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use("/api", userRoutes_1.default);
    app.listen(3001, () => {
        console.log("Server started on port 3001");
    });
})
    .catch((error) => {
    console.error("Failed to connect to the database:", error);
});
exports.default = app;
