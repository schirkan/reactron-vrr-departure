import { IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import { DepartureMonitor } from './components/DepartureMonitor/DepartureMonitor';
import { StationInputControl } from './components/StationInputControl';
import { StationInputForm } from './components/StationInputForm';

export * from './components/DepartureMonitor/DepartureMonitor';
export * from './components/StationInputForm';
export * from './components/StationInputControl';

export const components: IReactronComponentDefinition[] = [{
  component: DepartureMonitor,
  name: 'DepartureMonitor',
  description: 'Public Transport Departure Monitor',
  displayName: 'Public Transport Departure Monitor',
  fields: [{
    description: 'Station',
    displayName: 'Station',
    name: 'station',
    valueType: 'object',
    inputControl: StationInputControl,
    inputForm: StationInputForm
  }, {
    description: 'Show header',
    displayName: 'Show header',
    name: 'showHeader',
    valueType: 'boolean',
    defaultValue: true
  }]
}];