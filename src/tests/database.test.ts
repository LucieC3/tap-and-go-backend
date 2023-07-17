import { createConnection, Connection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

describe("Database Connection", () => {
  let connection: Connection;

  beforeAll(async () => {
    // Établir une connexion à la base de données
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  });

  afterAll(async () => {
    // Fermer la connexion à la base de données
    await connection.end();
  });

  it("should connect to the database", async () => {
    expect(connection).toBeTruthy();
  });

  it("should perform a successful database query", async () => {
    const [rows] = await connection.query("SELECT 1 + 1 AS solution");
    const result = rows[0].solution;
    expect(result).toBe(2);
  });
});
