import { IStation } from "./IStation";
import { TransportTypeEnum } from "./TransportTypeEnum";

export interface IDepartureRequest {
  station: IStation;
  platformVisibility: number;
  transport: TransportTypeEnum[];
  rowCount: number;
  distance: number;
}
