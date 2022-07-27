import rimraf from 'rimraf';
import webpackPaths from '../configs/webpack.paths.ts';
import process from 'process';

const foldersToRemove = [
  webpackPaths.distPath,
  webpackPaths.buildPath,
  webpackPaths.dllPath,
];

foldersToRemove.forEach((folder) => {
  rimraf.sync(folder);
});
