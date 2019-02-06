import { IReactronService } from "@schirkan/reactron-interfaces";
import { IDepartureList } from "./IDepartureList";
import { IStation } from "./IStation";

export interface IPublicTransportService extends IReactronService {
  getDepartures(station: IStation): Promise<IDepartureList>;
  getStations(query: string): Promise<IStation[]>;
}