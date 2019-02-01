import { IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import { DepartureMonitor } from './components/DepartureMonitor/DepartureMonitor';

export * from './components/DepartureMonitor/DepartureMonitor';

export const components: IReactronComponentDefinition[] = [{
  component: DepartureMonitor,
  name: 'DepartureMonitor',
  description: 'Public transport departure monitor',
  displayName: 'Public transport departure monitor',
  fields: [{
    description: 'Station',
    displayName: 'Station',
    name: 'station',
    valueType: 'string',
  }, {
    description: 'Show header',
    displayName: 'Show header',
    name: 'showHeader',
    valueType: 'boolean'
  }]
}];