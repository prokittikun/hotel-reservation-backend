import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogService } from './services/log/log.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logService = new LogService('main');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
  app.useStaticAssets(join(__dirname, '..', 'public/qrcode'), {
    prefix: '/qrcode/',
  });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Reservation Backend')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  logService.debug('start ... 3000');
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
