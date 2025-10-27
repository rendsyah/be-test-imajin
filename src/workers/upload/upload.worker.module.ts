import { Global, Module } from '@nestjs/common';

import { UploadWorkerService } from './upload.worker.service';

@Global()
@Module({
  providers: [UploadWorkerService],
  exports: [UploadWorkerService],
})
export class UploadWorkerModule {}
