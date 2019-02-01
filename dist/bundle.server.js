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

const baseUrl = 'http://api.openweathermap.org/data/2.5/'; // TODO
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
    getDepartures(station) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getApiUrl(station);
            return this.getResponse(url, PublicTransportService.mapToDepartureResponse);
        });
    }
    getApiUrl(station) {
        let url = baseUrl + '?APPID=' + station; // TODO
        return url;
    }
    getResponse(url, mapper) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
            // check timestamp
            if (this.cache[url] && this.cache[url].timestamp < validCacheTime) {
                delete (this.cache[url]);
            }
            if (!this.cache[url]) {
                this.cache[url] = {
                    timestamp: now,
                    result: this.getResponseInternal(url, mapper)
                };
            }
            else {
                this.context.log.debug('cache hit');
            }
            return this.cache[url].result;
        });
    }
    getResponseInternal(url, mapper) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('fetch', url);
            const response = yield request.get(url, { json: true, resolveWithFullResponse: true });
            if (response.statusCode !== 200) {
                this.context.log.error(response.statusMessage, response.body);
                throw new Error(response.statusMessage);
            }
            return mapper(response.body);
        });
    }
    static mapToDepartureResponse(response) {
        const result = response;
        // TODO
        return result;
    }
}

// export reactron service definition
const services = [{
        description: 'Service forpPublic transport in germany',
        displayName: 'Public transport information service',
        fields: [{
                defaultValue: 15,
                description: 'Cache duration in minutes',
                displayName: 'Cache duration (min)',
                name: 'cacheDuration',
                valueType: 'number',
                minValue: 5,
                maxValue: 120,
                stepSize: 5
            }],
        name: 'PublicTransportService',
        service: PublicTransportService
    }];

exports.services = services;
//# sourceMappingURL=bundle.server.js.map
