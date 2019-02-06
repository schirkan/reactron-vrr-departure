import { IReactronComponentContext, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { IPublicTransportService } from 'src/common/interfaces/IPublicTransportService';
import { IStation } from 'src/common/interfaces/IStation';
import { IDepartureList, IDepartureData } from 'src/common/interfaces/IDepartureList';

import './DepartureMonitor.scss';

interface IDepartureMonitorProps {
  station: IStation;
  showHeader: boolean;
}

interface IDepartureMonitorState {
  data?: IDepartureList;
  error?: any;
}

export class DepartureMonitor extends React.Component<IDepartureMonitorProps, IDepartureMonitorState> {
  public context: IReactronComponentContext;

  constructor(props: IDepartureMonitorProps) {
    super(props);
    this.state = {};
    this.loadData = this.loadData.bind(this);
    this.renderDeparture = this.renderDeparture.bind(this);
  }

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
      try {
        const departures = await service.getDepartures(this.props.station);
        this.setState({ data: departures });
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  private renderDeparture(item: IDepartureData) {
    const timezone = this.context.settings.timezone;
    const date = moment(item.originalDepartureTimestamp * 1000).tz(timezone);
    return (
      <React.Fragment key={item.lineNumber + item.directionCode + item.departureTimestamp.toString()}>
        <div>{date.format('LT')}</div>
        <div className="delay">{item.delay > 0 ? '+' + item.delay : ''}</div>
        <div>{item.lineNumber}</div>
        <div>{item.direction}</div>
        <div>
          <div className="route">{item.route}</div>
        </div>
        <div>{item.platform}</div>
      </React.Fragment>
    );
  }

  public render() {
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }

    if (!this.state.data) {
      return this.context.renderLoading('Loading...');
    }

    return (
      <section className="DepartureMonitor">
        <h2 className="header" hidden={!this.props.showHeader}>
          Departure for {this.props.station.name}
        </h2>
        <div className="departures">
          <div>Time</div>
          <div>Delay</div>
          <div>Line</div>
          <div>Direction</div>
          <div>Route</div>
          <div>Platform</div>
          {this.state.data.departures.map(this.renderDeparture)}
        </div>
      </section>
    );
  }
}
