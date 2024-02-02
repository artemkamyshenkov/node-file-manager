import { promises as fsPromises, constants } from 'fs';
import path from 'path';

export const removeFile = async (currentDir, pathToFile, cb) => {
  try {
    const joinFilePath = path.join(currentDir, pathToFile);
    await fsPromises.access(joinFilePath, constants.F_OK);
    await fsPromises.unlink(joinFilePath);
  } catch (error) {
    console.log('Operation failed');
  } finally {
    cb(currentDir);
  }
};
