import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { createStream } from 'rotating-file-stream';
import * as morgan from 'morgan';

var logStream = createStream('logs/api.log', {
  size: '5M',
  compress: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
