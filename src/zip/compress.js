import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';
import path from 'path';

export const compress = (currentDir, pathToFile, pathToZip, cb) => {
  const joinFilePath = path.join(currentDir, pathToFile);
  const joinZipPath = path.join(currentDir, pathToZip);

  const readStream = createReadStream(joinFilePath);
  const writeStream = createWriteStream(joinZipPath);
  const brotliStream = createBrotliCompress();
  readStream.pipe(brotliStream).pipe(writeStream);

  writeStream.on('finish', () => {
    cb(currentDir);
  });

  readStream.on('error', (err) => {
    console.log('Operation failed', err);
  });

  writeStream.on('error', (err) => {
    console.log('Operation failed', err);
  });
};
