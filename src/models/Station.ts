import { RowDataPacket } from "mysql2/promise";

export interface Station extends RowDataPacket {
  station_id: number;
  station_name: string;
  station_address: string;
  station_latitude: number;
  station_longitude: number;
  station_banking: boolean;
  station_status: string;
  station_availabilities_bikes: number;
  station_availabilities_stands: number;
  station_capacity: number;
}
