import * as RegularIcons from '@fortawesome/free-regular-svg-icons';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IInputComponentProps } from "@schirkan/reactron-interfaces";
import * as React from 'react';
import { IPublicTransportService } from "src/server";
import { IStation } from "src/common/interfaces/IStation";

interface IStationInputFormState {
  loading: boolean;
  stations?: IStation[];
  error?: any;
}

import './StationInputForm.scss';

export class StationInputForm extends React.Component<IInputComponentProps, IStationInputFormState> {
  private inputElement: HTMLInputElement | null;

  constructor(props: IInputComponentProps) {
    super(props);
    this.state = { loading: false };
    this.onEnter = this.onEnter.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  private async loadStation(query: string) {
    const service = await this.props.context.getService<IPublicTransportService>('PublicTransportService', 'reactron-vrr-departure');
    if (service) {
      try {
        const stations = await service.getStations(query);
        this.setState({ loading: false, stations, error: undefined });
      } catch (error) {
        this.setState({ loading: false, error });
      }
    }
  }

  private onSearch() {
    const query = this.inputElement!.value;
    if (query) {
      this.setState({ loading: true }, () => this.loadStation(query));
    }
  }

  private onSelect(station: IStation) {
    this.props.valueChange(this.props.definition, station);
  }

  private onEnter(e: React.KeyboardEvent) {
    if (e.keyCode === 10 || e.keyCode === 13) {
      this.onSearch();
    }
  }

  private renderSearch() {
    return (
      <div className="station-search">
        <input onKeyUp={this.onEnter} ref={el => this.inputElement = el} placeholder="Station" />
        <div className="clickable UiButton" onClick={this.onSearch}><FontAwesomeIcon icon={SolidIcons.faSearch} /></div>
      </div>
    );
  }

  private renderStations() {
    if (this.state.loading) {
      return <div className="station-list">{this.props.context.renderLoading(undefined, '1x')}</div>;
    }
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }
    if (!this.state.stations) {
      return null;
    }
    if (this.state.stations.length === 0) {
      return <div className="station-list">No results</div>;
    }

    const selectedStation = this.props.value as IStation;

    return (
      <div className="station-list">
        {this.state.stations.map(station => {
          const className = 'clickable UiButton' + (selectedStation.id === station.id ? ' selected' : '');
          const onClick = () => this.onSelect(station);
          return <div onClick={onClick} className={className}>{station.name}</div>;
        })}
      </div>
    );
  }

  public render() {
    return (
      <div className="StationInputForm">
        {this.renderSearch()}
        {this.renderStations()}
      </div>
    );
  }
}