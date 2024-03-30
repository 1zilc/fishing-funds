import { request, Dispatcher } from 'undici';

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
  public userAgent?: string;
  public dispatcher?: Dispatcher;

  public async request(url: string, config?: Omit<RequestConfig, 'responseType'>): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'text' }): Promise<HttpResponse<string>>;
  public async request(url: string, config?: RequestConfig & { responseType: 'arraybuffer' }): Promise<HttpResponse<ArrayBuffer>>;
  public async request<Res = unknown>(url: string, config?: RequestConfig & { responseType: 'json' }): Promise<HttpResponse<Res>>;
  public async request(url: string, config?: RequestConfig) {
    try {
      const res = await request(url, {
        headers: {
          'user-agent': this.userAgent,
          ...config?.headers,
        },
        body: config?.body,
        method: config?.method,
        dispatcher: this.dispatcher,
        query: config?.searchParams,
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
