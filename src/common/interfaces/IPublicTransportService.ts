import { IReactronService } from "@schirkan/reactron-interfaces";
import { IDepartureResponse } from "./IDepartureResponse";

export interface IPublicTransportService extends IReactronService {
     getDepartures(station: string): Promise<IDepartureResponse>;
}