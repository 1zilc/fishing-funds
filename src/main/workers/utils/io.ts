import * as fs from 'fs';
import { compose } from 'redux';
import { parseAsync } from 'json2csv';
import { encode, decode } from 'js-base64';

export function saveImage(filePath: string, dataUrl: string) {
  const imageBuffer = base64ToBuffer(dataUrl);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, imageBuffer, resolve);
  });
}

export function saveString(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, resolve);
  });
}

export async function saveJsonToCsv(filePath: string, json: any[]) {
  const fields = Object.keys(json[0] || {});
  const csv = await parseAsync(json, { fields });
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, csv, resolve);
  });
}

export function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      resolve(data);
    });
  });
}

export function base64ToBuffer(dataUrl: string) {
  const data = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const imageBuffer = Buffer.from(data![2], 'base64');
  return imageBuffer;
}

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
