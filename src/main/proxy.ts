import { Dispatcher, ProxyAgent } from 'undici';
import { socksDispatcher } from 'fetch-socks';

type ConnectionType = 'DIRECT' | 'SOCKS' | 'SOCKS5' | 'PROXY' | 'HTTPS';

export class ProxyParser {
  private host: string;

  private port: string;

  private type: ConnectionType;

  agent?: Dispatcher;

  constructor(proxyContent = 'DIRECT') {
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
          connect: { keepAlive: true },
        });
      } else {
        // DIRECT do nothing
      }
    } catch {}
  }
}
export class ProxyManager {
  agent?: Dispatcher;
  private proxyConent: string = '';

  updateAgentByParseProxyConent(content: string) {
    if (this.proxyConent !== content) {
      this.proxyConent = content;
      this.agent = new ProxyParser(content).agent;
    }
  }
}
