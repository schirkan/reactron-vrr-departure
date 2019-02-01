import { IReactronComponentContext, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';

import './DepartureMonitor.scss';
import { IPublicTransportService } from 'src/common/interfaces/IPublicTransportService';

interface IDepartureMonitorProps {
  station: string;
  showHeader: boolean;
}

interface IDepartureMonitorState {
  departures?: any;
  error?: any;
}

export class DepartureMonitor extends React.Component<IDepartureMonitorProps, IDepartureMonitorState> {
  public context: IReactronComponentContext;

  constructor(props: IDepartureMonitorProps) {
    super(props);
    this.state = {};
    this.loadData = this.loadData.bind(this);
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
        this.setState({ departures });
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  private renderDepartures() {
    if (!this.state.departures) {
      return;
    }

    // const timezone = this.context.settings.timezone;
    // const today = moment().tz(timezone);
    
    return <div>{JSON.stringify(this.state.departures)}</div>;
  }

  public render() {
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }

    if (!this.state.departures) {
      return this.context.renderLoading('Loading...');
    }

    return (
      <section className="DepartureMonitor">
        <div className="header" hidden={!this.props.showHeader}>
          Departure for {this.props.station}
        </div>
        {this.renderDepartures()}
      </section>
    );
  }
}
