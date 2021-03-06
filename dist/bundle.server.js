'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var request = require('request-promise-native');

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

const baseUrl = 'https://haltestellenmonitor.vrr.de/backend/api/stations/';
class PublicTransportService {
    constructor(context) {
        this.context = context;
        this.cache = {};
    }
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = options;
        });
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options;
        });
    }
    start(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // check and clear cache once per hour
            this.cacheClearInterval = setInterval(() => {
                const now = Date.now();
                const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
                Object.keys(this.cache).forEach(key => {
                    // check timestamp
                    if (this.cache[key] && this.cache[key].timestamp < validCacheTime) {
                        delete (this.cache[key]);
                    }
                });
            }, 60 * 60 * 1000);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.cacheClearInterval);
        });
    }
    getDepartures(options) {
        if (!options.distance || options.distance < 0) {
            options.distance = 0;
        }
        if (!options.platformVisibility || options.platformVisibility < 0) {
            options.platformVisibility = 1;
        }
        if (!options.rowCount || options.rowCount < 1) {
            options.rowCount = 6;
        }
        if (!options.transport) {
            options.transport = [0, 1, 2, 3, 4, 5];
        }
        const url = baseUrl + 'table';
        const cacheKey = url + JSON.stringify(options);
        const result = this.getOrCreate(cacheKey, () => {
            const requestOptions = {
                headers: { cookie: 'vrr-ef-lb=1530374336.20480.0000' },
                body: 'table[departure][stationName]=' + encodeURIComponent(options.station.name) +
                    '&table[departure][transport]=' + options.transport.join(',') +
                    '&table[departure][rowCount]=' + options.rowCount +
                    '&table[sortBy]=0' +
                    '&table[departure][platformVisibility]=' + options.platformVisibility +
                    '&table[departure][distance]=' + options.distance +
                    '&table[departure][stationId]=' + options.station.id
            };
            return this.getResponseInternal('post', url, requestOptions, PublicTransportService.mapToDepartureList);
        });
        return result;
    }
    getStations(query) {
        const url = baseUrl + 'search?query=' + encodeURI(query);
        const result = this.getOrCreate(url, () => {
            return this.getResponseInternal('get', url, {}, PublicTransportService.mapToStationList);
        });
        return result;
    }
    getResponseInternal(method, url, requestOptions, mapper) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('fetch', url);
            requestOptions = Object.assign(Object.assign({}, requestOptions), { json: true, rejectUnauthorized: false, resolveWithFullResponse: true });
            try {
                let response;
                switch (method) {
                    case "get":
                        response = yield request.get(url, requestOptions);
                        break;
                    case "post":
                        requestOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
                        response = yield request.post(url, requestOptions);
                        break;
                }
                if (!response) {
                    throw new Error('response is undefined');
                }
                if (response.statusCode !== 200) {
                    this.context.log.error(response.statusMessage, response.body);
                    throw new Error(response.statusMessage);
                }
                // this.context.log.debug(response.body);
                return mapper(response.body);
            }
            catch (error) {
                this.context.log.error(error);
                throw error;
            }
        });
    }
    getOrCreate(key, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
            // check timestamp
            if (this.cache[key] && this.cache[key].timestamp < validCacheTime) {
                delete (this.cache[key]);
            }
            if (!this.cache[key]) {
                this.cache[key] = { timestamp: now, result: creator() };
            }
            else {
                this.context.log.debug('cache hit');
            }
            return this.cache[key].result;
        });
    }
    static mapToDepartureList(response) {
        const result = {
            departures: response.departureData.map(item => ({
                departureTimestamp: item.fullTime,
                originalDepartureTimestamp: item.orgFullTime,
                name: item.name,
                lineNumber: item.lineNumber,
                subname: item.subname,
                direction: item.direction,
                directionCode: item.directionCode,
                route: item.route,
                type: item.type,
                platform: item.platform,
                delay: +item.delay,
            })),
            stationInfo: response.stationInfo,
            stationName: response.stationName,
        };
        return result;
    }
    static mapToStationList(response) {
        const suggestions = response.suggestions;
        const result = suggestions.map(item => ({
            id: +item.data,
            name: item.value,
        }));
        return result;
    }
}

// export reactron service definition
const services = [{
        description: 'Service for public transport in germany',
        displayName: 'Public transport information service',
        fields: [{
                defaultValue: 5,
                description: 'Cache duration in minutes',
                displayName: 'Cache duration (min)',
                name: 'cacheDuration',
                valueType: 'number',
                minValue: 0,
                maxValue: 60,
                stepSize: 1
            }],
        name: 'PublicTransportService',
        service: PublicTransportService
    }];

exports.services = services;
//# sourceMappingURL=bundle.server.js.map
