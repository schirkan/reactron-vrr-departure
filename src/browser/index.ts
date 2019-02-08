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
    displayName: 'Station',
    name: 'station',
    valueType: 'object',
    inputControl: StationInputControl,
    inputForm: StationInputForm
  }, {
    description: 'Distance to station in minutes',
    displayName: 'Walk time (in min)',
    name: 'distance',
    valueType: 'number',
    defaultValue: 0,
    minValue: 0,
    maxValue: 60
  }, {
    displayName: 'Show header',
    name: 'showHeader',
    valueType: 'boolean',
    defaultValue: true
  }, {
    displayName: 'Show columns',
    name: 'columns',
    valueType: 'object',
    fields: [{
      displayName: 'Delay',
      name: 'delay',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Line',
      name: 'line',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Direction',
      name: 'direction',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Route',
      name: 'route',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Platform',
      name: 'platform',
      valueType: 'boolean',
      defaultValue: true
    }]
  }, {
    displayName: 'Transport type',
    name: 'transport',
    valueType: 'object',
    fields: [{
      displayName: 'IC/ICE',
      name: 'longDistanceTrain',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'RE',
      name: 'regionalTrain',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'S-Bahn',
      name: 'sbahn',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Subway',
      name: 'subway',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Tram',
      name: 'tram',
      valueType: 'boolean',
      defaultValue: true
    }, {
      displayName: 'Bus',
      name: 'bus',
      valueType: 'boolean',
      defaultValue: true
    }]
  }, {
    displayName: 'Rows',
    name: 'rowCount',
    valueType: 'number',
    defaultValue: 6
  }, {
    displayName: 'Filter result',
    name: 'filter',
    valueType: 'object',
    fields: [{
      displayName: 'Line',
      name: 'line',
      valueType: 'string',
    }, {
      displayName: 'Direction',
      name: 'direction',
      valueType: 'string',
    }, {
      displayName: 'Platform',
      name: 'platform',
      valueType: 'string',
    }]
    // }, {
    //   displayName: 'platformVisibility',
    //   name: 'platformVisibility',
    //   valueType: 'number',
    //   defaultValue: 1
  }]
}];