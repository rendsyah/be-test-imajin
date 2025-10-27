import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skipTransform';
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

export const SKIP_LOGGING_KEY = 'skipLogging';
export const SkipLogging = () => SetMetadata(SKIP_LOGGING_KEY, true);
