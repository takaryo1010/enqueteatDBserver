import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookieのパースを有効にする
  app.use(cookieParser());
  // CSRFミドルウェアを追加
  app.use(csurf({ cookie: true }));
  app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
  const config = new DocumentBuilder()
    .setTitle('Forms API')
    .setDescription('The Forms API description')
    .setVersion('1.0')
    .addTag('forms')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: [/http:\/\/localhost(:\d+)?/], // すべてのローカルホストを許可
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });



  await app.listen(3000);
}
bootstrap();
