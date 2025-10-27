import fs from 'fs';
import path from 'path';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFilePaths = (filename: string) => {
  const relativePath = filename.replace('/media', '');
  const publicPath = path.join(process.cwd(), '..', 'public');
  const originPath = path.join(publicPath, 'tmp', path.basename(relativePath));
  const destPath = path.join(publicPath, path.dirname(relativePath));
  const filePath = path.join(publicPath, relativePath);

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  return {
    originPath,
    filePath,
  };
};
