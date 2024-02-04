import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

export const getHash = (currentDir, pathToFile, cb) => {
  const hash = createHash('sha256');
  const filePath = path.join(currentDir, pathToFile);
  const readStream = createReadStream(filePath);

  readStream.on('data', (data) => {
    hash.update(data);
  });

  readStream.on('end', () => {
    const fileHash = hash.digest('hex');
    console.log(fileHash);
    cb(currentDir);
  });

  readStream.on('error', (err) => {
    console.log('Operation failed', err);
  });
};
