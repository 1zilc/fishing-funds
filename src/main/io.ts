import * as fs from 'fs';
import { Parser } from '@json2csv/plainjs';

export async function saveImage(filePath: string, dataUrl: string) {
  const data = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const imageBuffer = Buffer.from(data![2], 'base64');
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, imageBuffer, resolve);
  });
}

export async function saveString(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, resolve);
  });
}

export async function saveJsonToCsv(filePath: string, json: any[]) {
  const parser = new Parser();
  const csv = parser.parse(json);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, csv, resolve);
  });
}

export async function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject();
      } else {
        resolve(data);
      }
    });
  });
}
