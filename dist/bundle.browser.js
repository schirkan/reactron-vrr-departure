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

            var css = "@-webkit-keyframes ticker {\n  0% {\n    margin-left: 0; }\n  100% {\n    margin-left: -100%; } }\n\n@keyframes ticker {\n  0% {\n    margin-left: 0; }\n  100% {\n    margin-left: -100%; } }\n\nsection.DepartureMonitor .departures {\n  display: grid;\n  grid-template-columns: -webkit-min-content -webkit-min-content -webkit-min-content -webkit-min-content auto -webkit-min-content;\n  grid-template-columns: min-content min-content min-content min-content auto min-content;\n  grid-column-gap: 8px;\n  white-space: nowrap; }\n  section.DepartureMonitor .departures .delay {\n    color: red; }\n  section.DepartureMonitor .departures > div {\n    overflow: hidden; }\n  section.DepartureMonitor .departures .route {\n    display: inline-block;\n    -webkit-animation: 10s linear infinite alternate ticker;\n            animation: 10s linear infinite alternate ticker; }\n  section.DepartureMonitor .departures > :nth-child(6n) {\n    text-align: right; }\n";
            styleInject(css);

            class DepartureMonitor extends Component {
                constructor(props) {
                    super(props);
                    this.state = {};
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
                            try {
                                const departures = yield service.getDepartures(this.props.station);
                                this.setState({ data: departures });
                            }
                            catch (error) {
                                this.setState({ error });
                            }
                        }
                    });
                }
                renderDeparture(item) {
                    const timezone = this.context.settings.timezone;
                    const date = moment(item.originalDepartureTimestamp * 1000).tz(timezone);
                    return (createElement(Fragment, { key: item.lineNumber + item.directionCode + item.departureTimestamp.toString() },
                        createElement("div", null, date.format('LT')),
                        createElement("div", { className: "delay" }, item.delay > 0 ? '+' + item.delay : ''),
                        createElement("div", null, item.lineNumber),
                        createElement("div", null, item.direction),
                        createElement("div", null,
                            createElement("div", { className: "route" }, item.route)),
                        createElement("div", null, item.platform)));
                }
                render() {
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.state.data) {
                        return this.context.renderLoading('Loading...');
                    }
                    return (createElement("section", { className: "DepartureMonitor" },
                        createElement("h2", { className: "header", hidden: !this.props.showHeader },
                            "Departure for ",
                            this.props.station.name),
                        createElement("div", { className: "departures" },
                            createElement("div", null, "Time"),
                            createElement("div", null, "Delay"),
                            createElement("div", null, "Line"),
                            createElement("div", null, "Direction"),
                            createElement("div", null, "Route"),
                            createElement("div", null, "Platform"),
                            this.state.data.departures.map(this.renderDeparture))));
                }
            } exports('DepartureMonitor', DepartureMonitor);

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
                        return createElement("div", { className: "station-list" }, this.props.context.renderLoading());
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
                }]);

        }
    };
});
//# sourceMappingURL=bundle.browser.js.map
