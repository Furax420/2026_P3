import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Toutes les routes de l'API commenceront par /api.
  app.setGlobalPrefix('api');

  // Autorise le frontend React à appeler le backend.
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Valide automatiquement les données reçues à partir des DTO.
  app.useGlobalPipes(
    // Evite de traiter des données non conformes au format attendu par le DTO
    new ValidationPipe({
      whitelist: true, // Limite les champs à ce que le DTO expose , pas d'injection admin = true par exemple
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Rend les fichiers du dossier uploads accessibles via /uploads.
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = configService.get<number>('PORT') ?? 3001;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ChâTop API')
    .setDescription('Documentation de l API ChâTop')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}

bootstrap();
