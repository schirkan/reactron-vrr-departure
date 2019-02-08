System.register(['@schirkan/reactron-interfaces', 'moment', 'react', '@fortawesome/free-solid-svg-icons', '@fortawesome/react-fontawesome'], function (exports, module) {
    'use strict';
    var topicNames, moment, Component, createElement, Fragment, faSearch, FontAwesomeIcon;
    return {
        setters: [function (module) {
            topicNames = module.topicNames;
        }, function (module) {
            moment = module.default;
        }, function (module) {
            Component = module.Component;
            createElement = module.createElement;
            Fragment = module.Fragment;
        }, function (module) {
            faSearch = module.faSearch;
        }, function (module) {
            FontAwesomeIcon = module.FontAwesomeIcon;
        }],
        execute: function () {

            /*! *****************************************************************************
            Copyright (c) Microsoft Corporation. All rights reserved.
            Licensed under the Apache License, Version 2.0 (the "License"); you may not use
            this file except in compliance with the License. You may obtain a copy of the
            License at http://www.apache.org/licenses/LICENSE-2.0

            THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
            WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
            MERCHANTABLITY OR NON-INFRINGEMENT.

            See the Apache Version 2.0 License for specific language governing permissions
            and limitations under the License.
            ***************************************************************************** */

            function __awaiter(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            }

            function styleInject(css, ref) {
              if (ref === void 0) ref = {};
              var insertAt = ref.insertAt;

              if (!css || typeof document === 'undefined') {
                return;
              }

              var head = document.head || document.getElementsByTagName('head')[0];
              var style = document.createElement('style');
              style.type = 'text/css';

              if (insertAt === 'top') {
                if (head.firstChild) {
                  head.insertBefore(style, head.firstChild);
                } else {
                  head.appendChild(style);
                }
              } else {
                head.appendChild(style);
              }

              if (style.styleSheet) {
                style.styleSheet.cssText = css;
              } else {
                style.appendChild(document.createTextNode(css));
              }
            }

            var css = "@-webkit-keyframes ticker {\n  0%, 10% {\n    margin-left: 0%;\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0); }\n  90%, 100% {\n    margin-left: 100%;\n    -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0); } }\n\n@keyframes ticker {\n  0%, 10% {\n    margin-left: 0%;\n    -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0); }\n  90%, 100% {\n    margin-left: 100%;\n    -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0); } }\n\nsection.DepartureMonitor .departures {\n  display: grid;\n  grid-column-gap: 8px;\n  white-space: nowrap; }\n  section.DepartureMonitor .departures > div {\n    overflow: hidden; }\n  section.DepartureMonitor .departures .delay {\n    color: red; }\n  section.DepartureMonitor .departures .route {\n    -webkit-animation: 10s linear infinite alternate ticker;\n            animation: 10s linear infinite alternate ticker;\n    display: inline-block; }\n  section.DepartureMonitor .departures .platform {\n    text-align: right; }\n";
            styleInject(css);

            class DepartureMonitor extends Component {
                constructor(props) {
                    super(props);
                    this.state = { loading: false };
                    this.loadData = this.loadData.bind(this);
                    this.renderDeparture = this.renderDeparture.bind(this);
                }
                componentDidMount() {
                    this.context.topics.subscribe(topicNames.refresh, this.loadData);
                    this.loadData();
                }
                componentWillUnmount() {
                    this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
                }
                componentDidUpdate(prevProps) {
                    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                        this.loadData();
                    }
                }
                loadData() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const service = yield this.context.getService('PublicTransportService');
                        if (service) {
                            const transport = [];
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
                                const departures = yield service.getDepartures({
                                    station: this.props.station,
                                    distance: this.props.distance,
                                    platformVisibility: this.props.platformVisibility,
                                    rowCount: this.props.rowCount,
                                    transport,
                                });
                                this.setState({ data: departures, loading: false });
                            }
                            catch (error) {
                                this.setState({ error, loading: false });
                            }
                        }
                    });
                }
                renderDeparture(item) {
                    const timezone = this.context.settings.timezone;
                    const date = moment(item.originalDepartureTimestamp * 1000).tz(timezone);
                    return (createElement(Fragment, { key: item.lineNumber + item.directionCode + item.departureTimestamp.toString() },
                        createElement("div", null, date.format('LT')),
                        this.props.columns.delay && (createElement("div", { className: "delay" }, item.delay > 0 ? '+' + item.delay : '')),
                        this.props.columns.line && (createElement("div", null, item.lineNumber)),
                        this.props.columns.direction && (createElement("div", null, item.direction)),
                        this.props.columns.route && (createElement("div", null,
                            createElement("div", { className: "route" }, item.route))),
                        this.props.columns.platform && (createElement("div", { className: "platform" }, item.platform))));
                }
                getFilteredDepartures() {
                    if (!this.state.data) {
                        return [];
                    }
                    return this.state.data.departures.filter(x => {
                        if (!this.props.filter)
                            return true;
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
                renderDepartures() {
                    if (!this.state.data) {
                        return null;
                    }
                    let gridTemplateColumns = 'min-content';
                    if (this.props.columns.delay)
                        gridTemplateColumns += ' min-content';
                    if (this.props.columns.line)
                        gridTemplateColumns += ' min-content';
                    if (this.props.columns.direction)
                        gridTemplateColumns += ' min-content';
                    if (this.props.columns.route)
                        gridTemplateColumns += ' auto';
                    if (this.props.columns.platform)
                        gridTemplateColumns += ' min-content';
                    return (createElement("div", { className: "departures", style: { gridTemplateColumns } },
                        createElement("div", null, "Time"),
                        this.props.columns.delay && (createElement("div", null, "Delay")),
                        this.props.columns.line && (createElement("div", null, "Line")),
                        this.props.columns.direction && (createElement("div", null, "Direction")),
                        this.props.columns.route && (createElement("div", null, "Route")),
                        this.props.columns.platform && (createElement("div", null, "Platform")),
                        this.getFilteredDepartures().map(this.renderDeparture)));
                }
                renderHeader() {
                    if (!this.props.showHeader) {
                        return null;
                    }
                    return (createElement("h2", null,
                        "Departure from ",
                        this.props.station.name,
                        (this.state.loading) && this.context.renderLoading(undefined, '1x', { display: 'inline-block', marginLeft: '8px' })));
                }
                render() {
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.props.station || !this.props.station.name || !this.props.station.id) {
                        return createElement("div", null, "No Station specified!");
                    }
                    return (createElement("section", { className: "DepartureMonitor" },
                        this.renderHeader(),
                        this.renderDepartures()));
                }
            } exports('DepartureMonitor', DepartureMonitor);
            DepartureMonitor.defaultProps = {
                transport: {
                    longDistanceTrain: true,
                    regionalTrain: true,
                    sbahn: true,
                    subway: true,
                    tram: true,
                    bus: true,
                },
                columns: {}
            };

            const StationInputControl = exports('StationInputControl', (props) => {
                const stationName = props.value && props.value.name;
                return stationName ? stationName : (createElement("span", { style: { color: 'red' } }, "missing"));
            });

            var css$1 = ".StationInputForm {\n  margin: 8px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  overflow: hidden; }\n  .StationInputForm .station-search {\n    display: grid;\n    grid-template-columns: auto -webkit-min-content;\n    grid-template-columns: auto min-content; }\n  .StationInputForm .station-list {\n    max-height: 256px;\n    overflow: auto;\n    border-top: 1px solid #ddd; }\n    .StationInputForm .station-list .selected {\n      background-color: #eef; }\n";
            styleInject(css$1);

            class StationInputForm extends Component {
                constructor(props) {
                    super(props);
                    this.state = { loading: false };
                    this.onEnter = this.onEnter.bind(this);
                    this.onSearch = this.onSearch.bind(this);
                }
                loadStation(query) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const service = yield this.props.context.getService('PublicTransportService', 'reactron-vrr-departure');
                        if (service) {
                            try {
                                const stations = yield service.getStations(query);
                                this.setState({ loading: false, stations, error: undefined });
                            }
                            catch (error) {
                                this.setState({ loading: false, error });
                            }
                        }
                    });
                }
                onSearch() {
                    const query = this.inputElement.value;
                    if (query) {
                        this.setState({ loading: true }, () => this.loadStation(query));
                    }
                }
                onSelect(station) {
                    this.props.valueChange(this.props.definition, station);
                }
                onEnter(e) {
                    if (e.keyCode === 10 || e.keyCode === 13) {
                        this.onSearch();
                    }
                }
                renderSearch() {
                    return (createElement("div", { className: "station-search" },
                        createElement("input", { onKeyUp: this.onEnter, ref: el => this.inputElement = el, placeholder: "Station" }),
                        createElement("div", { className: "clickable UiButton", onClick: this.onSearch },
                            createElement(FontAwesomeIcon, { icon: faSearch }))));
                }
                renderStations() {
                    if (this.state.loading) {
                        return createElement("div", { className: "station-list" }, this.props.context.renderLoading(undefined, '1x'));
                    }
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.state.stations) {
                        return null;
                    }
                    if (this.state.stations.length === 0) {
                        return createElement("div", { className: "station-list" }, "No results");
                    }
                    const selectedStation = this.props.value;
                    return (createElement("div", { className: "station-list" }, this.state.stations.map(station => {
                        const className = 'clickable UiButton' + (selectedStation.id === station.id ? ' selected' : '');
                        const onClick = () => this.onSelect(station);
                        return createElement("div", { onClick: onClick, className: className }, station.name);
                    })));
                }
                render() {
                    return (createElement("div", { className: "StationInputForm" },
                        this.renderSearch(),
                        this.renderStations()));
                }
            } exports('StationInputForm', StationInputForm);

            const components = exports('components', [{
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
                }]);

        }
    };
});
//# sourceMappingURL=bundle.browser.js.map
