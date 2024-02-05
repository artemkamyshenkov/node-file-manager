import { constants, promises as fsPromises } from 'fs';
import readline from 'node:readline';
import os from 'os';
import path from 'path';
import { copyFile } from './files/copy.js';
import { createFile } from './files/create.js';
import { readFileByPath } from './files/read.js';
import { renameFile } from './files/rename.js';
import {
  byeMessage,
  getUsername,
  greetMessage,
  printCurrentDirectory,
} from './messages/index.js';
import { moveFile } from './files/moveFile.js';
import { removeFile } from './files/remove.js';
import { getOsArgs } from './os/getOsArgs.js';
import { getOsCpus } from './os/getOsCpus.js';
import { getHash } from './hash/getHash.js';
import { compress } from './zip/compress.js';
import { decompress } from './zip/decompress.js';
import { printFilesAndFolders } from './files/printFiles.js';
import { getCommandArgs } from './helpers/getCommandArgs.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const homeDirectory = os.homedir();
let currentDirectory = homeDirectory;

console.log(greetMessage(getUsername()));

const navigateUp = () => {
  const parentDirectory = path.resolve(currentDirectory, '..');
  if (currentDirectory !== parentDirectory) {
    process.chdir(parentDirectory);
    currentDirectory = parentDirectory;
  }
  printCurrentDirectory(currentDirectory);
};

async function navigateToDirectory(directory) {
  try {
    const targetDirectory = path.resolve(currentDirectory, directory);
    await fsPromises.access(targetDirectory, constants.F_OK);
    process.chdir(targetDirectory);
    currentDirectory = targetDirectory;
  } catch (error) {
    console.log('Operation failed');
  } finally {
    printCurrentDirectory(currentDirectory);
  }
}

const handleCommand = (command) => {
  const args = getCommandArgs(command);

  if (command === '.exit') {
    rl.close();
  } else if (command === 'up') {
    navigateUp();
  } else if (args.action === 'cd') {
    navigateToDirectory(args.pathFrom);
  } else if (args.action === 'ls') {
    printFilesAndFolders(currentDirectory);
  } else if (args.action === 'cat') {
    readFileByPath(currentDirectory, args.pathFrom, printCurrentDirectory);
  } else if (args.action === 'add') {
    createFile(currentDirectory, args.pathFrom, printCurrentDirectory);
  } else if (args.action === 'rn') {
    renameFile(
      currentDirectory,
      args.pathFrom,
      args.pathTo,
      printCurrentDirectory,
    );
  } else if (args.action === 'cp') {
    copyFile(
      currentDirectory,
      args.pathFrom,
      args.pathTo,
      printCurrentDirectory,
    );
  } else if (args.action === 'mv') {
    moveFile(
      currentDirectory,
      args.pathFrom,
      args.pathTo,
      printCurrentDirectory,
    );
  } else if (args.action === 'rm') {
    removeFile(currentDirectory, args.pathFrom, printCurrentDirectory);
  } else if (getOsArgs(command) === 'EOL') {
    console.log(JSON.stringify(os.EOL));
  } else if (getOsArgs(command) === 'cpus') {
    getOsCpus();
  } else if (getOsArgs(command) === 'homedir') {
    console.log(homeDirectory);
  } else if (getOsArgs(command) === 'username') {
    console.log(os.userInfo().username);
  } else if (getOsArgs(command) === 'architecture') {
    console.log(process.arch);
  } else if (args.action === 'hash') {
    getHash(currentDirectory, args.pathFrom, printCurrentDirectory);
  } else if (args.action === 'compress') {
    compress(
      currentDirectory,
      args.pathFrom,
      args.pathTo,
      printCurrentDirectory,
    );
  } else if (args.action === 'decompress') {
    decompress(
      currentDirectory,
      args.pathFrom,
      args.pathTo,
      printCurrentDirectory,
    );
  } else {
    console.log('Invalid input');
  }
};

rl.on('line', (data) => {
  handleCommand(data.trim());
});

rl.on('close', () => {
  console.log(byeMessage(getUsername()));
  process.exit(0);
});
