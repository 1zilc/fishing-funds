import { Dispatcher, ProxyAgent } from 'undici';
import { socksDispatcher } from 'fetch-socks';

type ConnectionType = 'DIRECT' | 'SOCKS' | 'SOCKS5' | 'PROXY' | 'HTTPS';

export default class Proxy {
  private host: string;

  private port: string;

  private type: ConnectionType;

  agent?: Dispatcher;

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
    try {
      if (this.type === 'SOCKS' || this.type === 'SOCKS5') {
        this.agent = socksDispatcher({
          host: this.host,
          port: Number(this.port),
          type: 5,
        });
      } else if (this.type === 'PROXY' || this.type === 'HTTPS') {
        const proxyURL = `http://${this.host}:${this.port}`;
        this.agent = new ProxyAgent({
          uri: proxyURL,
          allowH2: true,
          connect: { keepAlive: true },
        });
      } else {
        // DIRECT do nothing
      }
    } catch {}
  }
}
