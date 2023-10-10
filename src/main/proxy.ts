import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'http';

type ConnectionType = 'DIRECT' | 'SOCKS' | 'SOCKS5' | 'PROXY' | 'HTTPS';

export default class Proxy {
  private host: string;

  private port: string;

  private type: ConnectionType;

  httpAgent?: Agent;

  httpsAgent?: Agent;

  constructor(proxyContent = 'DIRECT', private url: string) {
    // default to "DIRECT" if a falsey value was returned (or nothing)

    const proxies = String(proxyContent)
      .trim()
      .split(/\s*;\s*/g)
      .filter(Boolean);

    const first = proxies[0];
    const parts = first.split(/\s+/);

    const [host, port] = (parts[1] || '').split(':');

    this.type = parts[0] as ConnectionType;
    this.host = host;
    this.port = port;
    this.url = url;
    this.constructAgents();
  }

  constructAgents() {
    if (this.type === 'SOCKS' || this.type === 'SOCKS5') {
      const proxyURL = `socks:${this.host}:${this.port}`;
      const agent = new SocksProxyAgent(proxyURL);

      this.httpAgent = agent;
      this.httpsAgent = agent;
    } else if (this.type === 'PROXY' || this.type === 'HTTPS') {
      const proxyURL = `http:${this.host}:${this.port}`;

      if (this.url.startsWith('https://')) {
        this.httpsAgent = new HttpsProxyAgent(proxyURL);
      } else {
        this.httpAgent = new HttpProxyAgent(proxyURL);
      }
    } else {
      // DIRECT do nothing
    }
  }
}
