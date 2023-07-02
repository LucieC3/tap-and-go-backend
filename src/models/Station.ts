export interface Station {
  stationId: number;
  name: string;
  address: string;
  position: {
    latitude: number;
    longitude: number;
  };
  banking: boolean;
  status: string;
  totalStands: {
    availabilities: {
      bikes: number;
      stands: number;
    };
    capacity: number;
  };
}
