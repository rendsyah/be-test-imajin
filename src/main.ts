import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { SwaggerService } from './commons/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '50mb' }));

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  if (AppModule.docs) {
    const swagger = SwaggerService(app);
    SwaggerModule.setup('/api/docs-045ut', app, swagger);
  }

  await app.listen(AppModule.port, () => console.log(`SERVER RUNNING ON PORT ${AppModule.port}`));
}
void bootstrap();
