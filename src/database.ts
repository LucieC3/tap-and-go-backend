import { createConnection, Connection } from "mysql2/promise";

let connection: Connection | undefined;

export const connectToDB = async (): Promise<void> => {
  try {
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

export const getDBConnection = (): Connection => {
  if (!connection) {
    throw new Error("Database connection has not been established");
  }

  return connection;
};
