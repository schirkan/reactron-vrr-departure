import { IReactronServiceDefinition } from '@schirkan/reactron-interfaces';
import { PublicTransportService } from './services/PublicTransportService';

// export interfaces
export * from '../common/interfaces/IDepartureList';
export * from '../common/interfaces/IPublicTransportService';
export * from '../common/interfaces/IPublicTransportServiceOptions';

// export reactron service definition
export const services: IReactronServiceDefinition[] = [{
  description: 'Service for public transport in germany',
  displayName: 'Public transport information service',
  fields: [{
    defaultValue: 5,
    description: 'Cache duration in minutes',
    displayName: 'Cache duration (min)',
    name: 'cacheDuration',
    valueType: 'number',
    minValue: 0,
    maxValue: 60,
    stepSize: 1
  }],
  name: 'PublicTransportService',
  service: PublicTransportService
}];