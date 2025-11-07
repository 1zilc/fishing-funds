// @ts-expect-error: cacheStores should exist--it does not
import { Agent, request, Dispatcher, interceptors, cacheStores } from 'undici';
import enhInterceptors from '@lib/enh/httpInterceptors';

export type RequestConfig = {
  responseType?: 'json' | 'text' | 'arraybuffer';
  headers?: Record<string, string>;
  searchParams?: Record<string, any>;
  method?: Dispatcher.RequestOptions['method'];
  body?: Dispatcher.RequestOptions['body'];
};
export type HttpResponse<T> = {
  body: T;
  headers: Dispatcher.RequestOptions['headers'];
};

export default class HttpClient {
  private static agent = new Agent({
    connect: { keepAlive: true },
  });
  public userAgent?: string;
  public dispatcher?: Dispatcher;

  public async request(url: string, config?: Omit<RequestConfig, 'responseType'>): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'text' }): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'arraybuffer' }): Promise<HttpResponse<ArrayBuffer>>;
  public async request<Res = unknown>(url: string, config?: RequestConfig & { responseType: 'json' }): Promise<HttpResponse<Res>>;
  public async request(url: string, config?: RequestConfig) {
    try {
      const headers = {
        'User-Agent': this.userAgent,
        'Host': new URL(url).host,
        ...config?.headers,
      } as Record<string, string>;

      const dispatcher = this.dispatcher || HttpClient.agent;

      const res = await request(url, {
        headers,
        body: config?.body,
        method: config?.method,
        query: config?.searchParams,
        dispatcher: dispatcher.compose(
          interceptors.cache({
            store: new cacheStores.MemoryCacheStore({
              maxSize: 50 * 1024 * 1024,
              maxCount: 1000,
              maxEntrySize: 2 * 1024 * 1024,
            }),
            methods: ['GET'],
          }),
          ...enhInterceptors
        ),
      });
      if (config?.responseType === 'json') {
        return {
          body: await res.body.json(),
          headers: res.headers,
        };
      } else if (config?.responseType === 'arraybuffer') {
        return {
          body: await res.body.arrayBuffer(),
          headers: res.headers,
        };
      } else {
        return {
          body: await res.body.text(),
          headers: res.headers,
        };
      }
    } catch (e) {
      return {} as any;
    }
  }
}
