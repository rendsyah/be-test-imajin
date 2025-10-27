import fs from 'fs';
import sharp from 'sharp';

import { logger } from 'src/commons/logger';

import { getFilePaths, sleep } from '../utils';
import {
  ProcessorFn,
  UploadWorkerRequest,
  UploadWorkerTask,
  ProcessorWorker,
} from './upload.worker.types';

const processImage: ProcessorFn = async (originPath, filePath) => {
  await sharp(originPath)
    .resize(800, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(filePath);
};

const processFile: ProcessorFn = async (originPath, filePath) => {
  await fs.promises.copyFile(originPath, filePath);
};

const createUploadProcessor = (
  processorFn: ProcessorFn,
  processorName: string,
  shouldResize: boolean,
) => {
  const processWithRetry = async (data: ProcessorWorker) => {
    const { context, filename, retries = 3, maxRetries = 3, backoffMs = 1000 } = data;

    const attempt = maxRetries + 1 - retries;
    const startTime = Date.now();

    const req = {
      context,
      filename,
      attempt,
      retries,
      maxRetries,
      backoffMs,
    };

    try {
      const paths = getFilePaths(filename);

      await processorFn(paths.originPath, paths.filePath);

      await fs.promises.unlink(paths.originPath);

      logger.info(`${processorName} processing success`, {
        labels: { service: 'upload-worker-service' },
        req,
        res: {
          success: true,
          resize: shouldResize,
          filename,
        },
        responseTime: Date.now() - startTime,
      });
    } catch (err) {
      const stack = {
        name: err?.name ?? 'UnknownError',
        message: err?.message ?? JSON.stringify(err),
        stack: err?.stack ?? '',
      };

      logger.warn(`Retrying ${processorName} processing... attempt ${attempt} of ${maxRetries}`, {
        labels: { service: 'upload-worker-service' },
        req,
        stack,
      });

      if (retries > 0) {
        await sleep(backoffMs);
        await processWithRetry({
          context,
          filename,
          retries: retries - 1,
          maxRetries,
          backoffMs,
        });
      } else {
        logger.error(`${processorName} processing failed`, {
          labels: { service: 'upload-worker-service' },
          req,
          stack,
          responseTime: Date.now() - startTime,
        });
      }
    }
  };

  return processWithRetry;
};

const imageProcessing = createUploadProcessor(processImage, 'Image', true);
const fileProcessing = createUploadProcessor(processFile, 'File', false);

const tasks: UploadWorkerTask = {
  'image.processing': imageProcessing,
  'file.processing': fileProcessing,
};

export default async (input: UploadWorkerRequest) => {
  const task = tasks[input.task];

  if (!task) {
    throw new Error('Invalid task');
  }

  return task(input.data);
};
