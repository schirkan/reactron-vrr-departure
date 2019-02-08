import { IReactronService } from "@schirkan/reactron-interfaces";
import { IDepartureList } from "./IDepartureList";
import { IStation } from "./IStation";
import { IDepartureRequest } from "./IDepartureRequest";

export interface IPublicTransportService extends IReactronService {
  getDepartures(options: IDepartureRequest): Promise<IDepartureList>;
  getStations(query: string): Promise<IStation[]>;
}