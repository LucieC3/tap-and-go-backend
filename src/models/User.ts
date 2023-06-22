import { Connection } from "mysql2/promise";

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
}

export const createUser = async (
  connection: Connection,
  user: User
): Promise<number> => {
  const [result] = await connection.query("INSERT INTO users SET ?", user);
  return (result as any).insertId;
};
