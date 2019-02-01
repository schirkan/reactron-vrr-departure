System.register(['@schirkan/reactron-interfaces', 'react'], function (exports, module) {
    'use strict';
    var topicNames, Component, createElement;
    return {
        setters: [function (module) {
            topicNames = module.topicNames;
        }, function (module) {
            Component = module.Component;
            createElement = module.createElement;
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
              if ( ref === void 0 ) ref = {};
              var insertAt = ref.insertAt;

              if (!css || typeof document === 'undefined') { return; }

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

            var css = "";
            styleInject(css);

            class DepartureMonitor extends Component {
                constructor(props) {
                    super(props);
                    this.state = {};
                    this.loadData = this.loadData.bind(this);
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
                                this.setState({ departures });
                            }
                            catch (error) {
                                this.setState({ error });
                            }
                        }
                    });
                }
                renderDepartures() {
                    if (!this.state.departures) {
                        return;
                    }
                    // const timezone = this.context.settings.timezone;
                    // const today = moment().tz(timezone);
                    return createElement("div", null, JSON.stringify(this.state.departures));
                }
                render() {
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.state.departures) {
                        return this.context.renderLoading('Loading...');
                    }
                    return (createElement("section", { className: "DepartureMonitor" },
                        createElement("div", { className: "header", hidden: !this.props.showHeader },
                            "Departure for ",
                            this.props.station),
                        this.renderDepartures()));
                }
            } exports('DepartureMonitor', DepartureMonitor);

            const components = exports('components', [{
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
                }]);

        }
    };
});
//# sourceMappingURL=bundle.browser.js.map
