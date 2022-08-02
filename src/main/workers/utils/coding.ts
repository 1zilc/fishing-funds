import { compose } from 'redux';
import { encode, decode } from 'js-base64';

export function encodeFF(content: any) {
  const ffprotocol = 'ff://'; // FF协议
  return `${ffprotocol}${encode(JSON.stringify(content))}`;
}

export function decodeFF(content: string) {
  const ffprotocol = 'ff://'; // FF协议
  try {
    const protocolLength = ffprotocol.length;
    const protocol = content.slice(0, protocolLength);
    if (protocol !== ffprotocol) {
      throw Error('协议错误');
    }
    const body = content.slice(protocolLength);
    return JSON.parse(decode(body));
  } catch (error) {
    return null;
  }
}

export function encryptFF(content: string) {
  return compose(encode, encodeFF)(content);
}

export function decryptFF(content: string) {
  return compose(decodeFF, decode)(content);
}
