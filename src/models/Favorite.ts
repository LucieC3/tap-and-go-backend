import { RowDataPacket } from "mysql2/promise";

export interface Favorite extends RowDataPacket {
  favorite_id: number;
  station_id: number;
  user_id: number;
}
