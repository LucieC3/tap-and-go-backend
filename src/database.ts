import { createConnection, Connection } from "mysql2/promise";

let connection: Connection;

export const connectToDB = async (): Promise<void> => {
  connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

export default connection;
