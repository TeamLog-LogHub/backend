import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { isDevelopment } from './utils/env';
import { INestApplication, Logger } from '@nestjs/common';

function swagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('LogHub API')
    .setDescription('The LogHub API description')
    .setVersion('1.0')
    .addTag('teamlog')
    .addTag('loghub')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('document', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (isDevelopment()) swagger(app);

  await app.listen(3000);

  Logger.log(`Server running on http://localhost:3000`, 'Bootstrap');
  if (isDevelopment())
    Logger.log(
      `Swagger running on http://localhost:3000/document`,
      'Bootstrap',
    );
}
bootstrap();
