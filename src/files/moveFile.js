import {
  promises as fsPromises,
  constants,
  createReadStream,
  createWriteStream,
} from 'fs';
import path from 'path';

export const moveFile = async (currentDir, pathToFile, pathToNewFile, cb) => {
  try {
    const joinFilePath = path.join(currentDir, pathToFile);
    const joinNewFilePath = path.join(currentDir, pathToNewFile);
    await fsPromises.access(joinFilePath, constants.F_OK);
    const readStream = createReadStream(joinFilePath);
    const writeStream = createWriteStream(joinNewFilePath);
    readStream.pipe(writeStream);
  } catch (error) {
    console.log('Operation failed');
  } finally {
    await fsPromises.unlink(joinFilePath);
    cb(currentDir);
  }
};
