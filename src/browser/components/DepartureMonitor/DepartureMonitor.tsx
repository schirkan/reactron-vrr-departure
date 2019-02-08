import { IReactronComponentContext, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { IPublicTransportService } from 'src/common/interfaces/IPublicTransportService';
import { IDepartureList, IDepartureData } from 'src/common/interfaces/IDepartureList';
import { IDepartureRequest } from 'src/common/interfaces/IDepartureRequest';
import { IStation } from 'src/common/interfaces/IStation';

import './DepartureMonitor.scss';

interface IDepartureMonitorProps {
  station: IStation;
  platformVisibility: number;
  rowCount: number;
  distance: number;
  showHeader: boolean;
  columns: {
    delay: boolean;
    line: boolean;
    direction: boolean;
    route: boolean;
    platform: boolean;
  };
  transport: {
    longDistanceTrain: boolean;
    regionalTrain: boolean;
    sbahn: boolean;
    subway: boolean;
    tram: boolean;
    bus: boolean;
  };
  filter: {
    line: string;
    direction: string;
    platform: string;
  };
}

interface IDepartureMonitorState {
  loading: boolean;
  data?: IDepartureList;
  error?: any;
}

export class DepartureMonitor extends React.Component<IDepartureMonitorProps, IDepartureMonitorState> {
  public context: IReactronComponentContext;

  constructor(props: IDepartureMonitorProps) {
    super(props);
    this.state = { loading: false };
    this.loadData = this.loadData.bind(this);
    this.renderDeparture = this.renderDeparture.bind(this);
  }

  public static defaultProps: Partial<IDepartureMonitorProps> = {
    transport: {
      longDistanceTrain: true,
      regionalTrain: true,
      sbahn: true,
      subway: true,
      tram: true,
      bus: true,
    },
    columns: {} as any
  };

  public componentDidMount() {
    this.context.topics.subscribe(topicNames.refresh, this.loadData);
    this.loadData();
  }

  public componentWillUnmount() {
    this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
  }

  public componentDidUpdate(prevProps: any) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.loadData();
    }
  }

  private async loadData() {
    const service = await this.context.getService<IPublicTransportService>('PublicTransportService');
    if (service) {
      const transport: number[] = [];

      if (this.props.transport.longDistanceTrain) {
        transport.push(0);
      }
      if (this.props.transport.regionalTrain) {
        transport.push(1);
      }
      if (this.props.transport.sbahn) {
        transport.push(2);
      }
      if (this.props.transport.subway) {
        transport.push(3);
      }
      if (this.props.transport.tram) {
        transport.push(4);
      }
      if (this.props.transport.bus) {
        transport.push(5);
      }

      this.setState({ loading: true });

      try {
        const departures = await service.getDepartures({
          station: this.props.station,
          distance: this.props.distance,
          platformVisibility: this.props.platformVisibility,
          rowCount: this.props.rowCount,
          transport,
        } as IDepartureRequest);

        this.setState({ data: departures, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  private renderDeparture(item: IDepartureData) {
    const timezone = this.context.settings.timezone;
    const date = moment(item.originalDepartureTimestamp * 1000).tz(timezone);
    return (
      <React.Fragment key={item.lineNumber + item.directionCode + item.departureTimestamp.toString()}>
        <div>{date.format('LT')}</div>
        {this.props.columns.delay && (<div className="delay">{item.delay > 0 ? '+' + item.delay : ''}</div>)}
        {this.props.columns.line && (<div>{item.lineNumber}</div>)}
        {this.props.columns.direction && (<div>{item.direction}</div>)}
        {this.props.columns.route && (<div><div className="route">{item.route}</div></div>)}
        {this.props.columns.platform && (<div className="platform">{item.platform}</div>)}
      </React.Fragment>
    );
  }

  private getFilteredDepartures() {
    if (!this.state.data) {
      return []
    }
    return this.state.data.departures.filter(x => {
      if (!this.props.filter) return true;
      let show = true;
      if (this.props.filter.direction) {
        show = x.direction.includes(this.props.filter.direction);
      }
      if (show && this.props.filter.line) {
        show = x.lineNumber === this.props.filter.line;
      }
      if (show && this.props.filter.platform) {
        show = x.platform === this.props.filter.platform;
      }
      return show;
    });
  }

  private renderDepartures() {
    if (!this.state.data) {
      return null;
    }

    let gridTemplateColumns = 'min-content';
    if (this.props.columns.delay) gridTemplateColumns += ' min-content';
    if (this.props.columns.line) gridTemplateColumns += ' min-content';
    if (this.props.columns.direction) gridTemplateColumns += ' min-content';
    if (this.props.columns.route) gridTemplateColumns += ' auto';
    if (this.props.columns.platform) gridTemplateColumns += ' min-content';

    return (
      <div className="departures" style={{ gridTemplateColumns }}>
        <div>Time</div>
        {this.props.columns.delay && (<div>Delay</div>)}
        {this.props.columns.line && (<div>Line</div>)}
        {this.props.columns.direction && (<div>Direction</div>)}
        {this.props.columns.route && (<div>Route</div>)}
        {this.props.columns.platform && (<div>Platform</div>)}
        {this.getFilteredDepartures().map(this.renderDeparture)}
      </div>
    );
  }

  private renderHeader() {
    if (!this.props.showHeader) {
      return null;
    }
    return (
      <h2>
        Departure from {this.props.station.name}
        {(this.state.loading) && this.context.renderLoading(undefined, '1x', { display: 'inline-block', marginLeft: '8px' })}
      </h2>
    );
  }

  public render() {
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }

    if (!this.props.station || !this.props.station.name || !this.props.station.id) {
      return <div>No Station specified!</div>;
    }

    return (
      <section className="DepartureMonitor">
        {this.renderHeader()}
        {this.renderDepartures()}
      </section>
    );
  }
}
