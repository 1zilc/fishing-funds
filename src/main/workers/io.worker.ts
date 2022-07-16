import * as fs from 'fs';
import { parseAsync } from 'json2csv';
import registerPromiseWorker from 'promise-worker/register';

interface WorkerRecieveParams {
  module: string;
  filePath: string;
  data: any;
}

registerPromiseWorker(async (params: WorkerRecieveParams) => {
  switch (params.module) {
    case 'saveImage':
      return saveImage(params.filePath, params.data);
    case 'saveString':
      return saveString(params.filePath, params.data);
    case 'saveJsonToCsv':
      return saveJsonToCsv(params.filePath, params.data);
    case 'readFile':
      return readFile(params.filePath);
  }
});

function saveImage(filePath: string, dataUrl: string) {
  const imageBuffer = base64ToBuffer(dataUrl);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, imageBuffer, resolve);
  });
}

function saveString(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, resolve);
  });
}
async function saveJsonToCsv(filePath: string, json: any[]) {
  const fields = Object.keys(json[0] || {});
  const csv = await parseAsync(json, { fields });
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, csv, resolve);
  });
}
function readFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      resolve(data);
    });
  });
}

function base64ToBuffer(dataUrl: string) {
  const data = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const imageBuffer = Buffer.from(data![2], 'base64');
  return imageBuffer;
}
