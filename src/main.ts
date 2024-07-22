import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // logger obj
  const logger = new Logger('bootstrap');
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log('Application server started at port ' + port);
}
bootstrap();
