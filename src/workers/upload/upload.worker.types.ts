export type UploadWorkerTaskMap = {
  'image.processing': ProcessorWorker;
  'file.processing': ProcessorWorker;
};

export type UploadWorkerTask = {
  [K in keyof UploadWorkerTaskMap]: (data: UploadWorkerTaskMap[K]) => Promise<void>;
};

export type UploadWorkerRequest<T extends keyof UploadWorkerTaskMap = keyof UploadWorkerTaskMap> = {
  task: T;
  data: UploadWorkerTaskMap[T];
};

export type ProcessorFn = (originPath: string, filePath: string) => Promise<void>;

export type ProcessorWorker = {
  context: string;
  filename: string;

  // current attempt count
  retries?: number;

  // constant max retries allowed (immutable once passed)
  maxRetries?: number;

  // optional delay between retries in milliseconds
  backoffMs?: number;
};
