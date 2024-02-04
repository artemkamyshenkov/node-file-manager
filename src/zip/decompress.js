import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'zlib';
import path from 'path';

export const decompress = (currentDir, pathToFile, outputPath, cb) => {
  const joinFilePath = path.join(currentDir, pathToFile);
  const joinZipPath = path.join(currentDir, outputPath);

  const readStream = createReadStream(joinFilePath);
  const writeStream = createWriteStream(joinZipPath);
  const brotliStream = createBrotliDecompress();
  readStream.pipe(brotliStream).pipe(writeStream);

  writeStream.on('finish', () => {
    cb(currentDir);
  });

  readStream.on('error', () => {
    console.log('Operation failed');
  });

  writeStream.on('error', () => {
    console.log('Operation failed');
  });
};
