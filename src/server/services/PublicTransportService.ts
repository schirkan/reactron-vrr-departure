import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { IPublicTransportServiceOptions } from 'src/common/interfaces/IPublicTransportServiceOptions';
import { IPublicTransportService } from 'src/common/interfaces/IPublicTransportService';
import { IDepartureList, IDepartureResponse, IDepartureData } from 'src/common/interfaces/IDepartureList';
import { IStation } from 'src/common/interfaces/IStation';
import { IDepartureRequest } from 'src/common/interfaces/IDepartureRequest';

const baseUrl = 'https://haltestellenmonitor.vrr.de/backend/api/stations/';

interface ICacheItem {
  timestamp: number;
  result: Promise<any>;
}

export class PublicTransportService implements IPublicTransportService {
  private options: IPublicTransportServiceOptions;
  private cache: { [url: string]: ICacheItem } = {};
  private cacheClearInterval: any;

  constructor(private context: IReactronServiceContext) { }

  public async setOptions(options: IPublicTransportServiceOptions): Promise<void> {
    this.options = options;
  }

  public async getOptions(): Promise<Readonly<IPublicTransportServiceOptions>> {
    return this.options;
  }

  public async start?(context: IReactronServiceContext): Promise<void> {
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
  }

  public async  stop?(): Promise<void> {
    clearInterval(this.cacheClearInterval);
  }

  public getDepartures(options: IDepartureRequest): Promise<IDepartureList> {
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
      const requestOptions: request.RequestPromiseOptions = {
        headers: { cookie: 'vrr-ef-lb=1530374336.20480.0000' },
        body:
          'table[departure][stationName]=' + encodeURIComponent(options.station.name) +
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

  public getStations(query: string): Promise<IStation[]> {
    const url = baseUrl + 'search?query=' + encodeURI(query);
    const result = this.getOrCreate<IStation[]>(url, () => {
      return this.getResponseInternal('get', url, {}, PublicTransportService.mapToStationList);
    });
    return result;
  }

  private async getResponseInternal<TResponse>(method: 'get' | 'post', url: string,
    requestOptions: request.RequestPromiseOptions, mapper: (response: any) => TResponse): Promise<TResponse> {
    this.context.log.debug('fetch', url);
    requestOptions = { ...requestOptions, json: true, rejectUnauthorized: false, resolveWithFullResponse: true };

    try {
      let response: request.FullResponse | undefined;
      switch (method) {
        case "get":
          response = await request.get(url, requestOptions);
          break;
        case "post":
          requestOptions.headers!["Content-Type"] = "application/x-www-form-urlencoded";
          response = await request.post(url, requestOptions);
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
    } catch (error) {
      this.context.log.error(error);
      throw error;
    }
  }

  private async getOrCreate<TResponse>(key: string, creator: () => Promise<TResponse>): Promise<TResponse> {
    const now = Date.now();
    const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);

    // check timestamp
    if (this.cache[key] && this.cache[key].timestamp < validCacheTime) {
      delete (this.cache[key]);
    }

    if (!this.cache[key]) {
      this.cache[key] = { timestamp: now, result: creator() };
    } else {
      this.context.log.debug('cache hit');
    }

    return this.cache[key].result;
  }

  private static mapToDepartureList(response: any): IDepartureList {
    const result: IDepartureList = {
      departures: (response.departureData as IDepartureResponse[]).map(item => ({
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
      } as IDepartureData)),
      stationInfo: response.stationInfo,
      stationName: response.stationName,
    };
    return result;
  }

  private static mapToStationList(response: any): IStation[] {
    const suggestions: { data: string, value: string }[] = response.suggestions;
    const result: IStation[] = suggestions.map(item => ({
      id: +item.data,
      name: item.value,
    } as IStation));
    return result;
  }
}