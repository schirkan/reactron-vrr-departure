import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { IPublicTransportServiceOptions } from 'src/common/interfaces/IPublicTransportServiceOptions';
import { IPublicTransportService } from 'src/common/interfaces/IPublicTransportService';
import { IDepartureResponse } from 'src/common/interfaces/IDepartureResponse';

const baseUrl = 'http://api.openweathermap.org/data/2.5/'; // TODO

interface ICacheItem {
  timestamp: number;
  result: Promise<any>;
}

export class PublicTransportService implements IPublicTransportService {
  private options: IPublicTransportServiceOptions;
  private cache: { [url: string]: ICacheItem } = {};

  constructor(private context: IReactronServiceContext) { }

  public async setOptions(options: IPublicTransportServiceOptions): Promise<void> {
    this.options = options;
  }

  public async getOptions(): Promise<Readonly<IPublicTransportServiceOptions>> {
    return this.options;
  }

  public async getDepartures(station: string): Promise<IDepartureResponse> {
    const url = this.getApiUrl(station);
    return this.getResponse(url, PublicTransportService.mapToDepartureResponse);
  }

  private getApiUrl(station: string): string {
    let url = baseUrl + '?APPID=' + station; // TODO
    return url;
  }

  private async getResponse<TResponse>(url: string, mapper: (response: any) => TResponse): Promise<TResponse> {
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
    } else {
      this.context.log.debug('cache hit');
    }

    return this.cache[url].result;
  }

  private async getResponseInternal<TResponse>(url: string, mapper: (response: any) => TResponse): Promise<TResponse> {
    this.context.log.debug('fetch', url);
    const response = await request.get(url, { json: true, resolveWithFullResponse: true }) as request.FullResponse;
    if (response.statusCode !== 200) {
      this.context.log.error(response.statusMessage, response.body);
      throw new Error(response.statusMessage);
    }
    return mapper(response.body);
  }

  private static mapToDepartureResponse(response: any): IDepartureResponse {
    const result: IDepartureResponse = response
    // TODO
    return result;
  }
}