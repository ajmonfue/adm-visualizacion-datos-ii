import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService: ConfigService = app.get(ConfigService);
  app.use(bodyParser.json({limit: '50mb'}));
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
