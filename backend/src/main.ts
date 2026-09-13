import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';

// Point d'entrée du backend NestJS.
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ConfigService lit notamment PORT, DATABASE_URL et JWT_SECRET depuis le .env.
  const configService = app.get(ConfigService);

  // Toutes les routes métier commencent par /api.
  app.setGlobalPrefix('api');

  // Autorise le frontend React local à appeler le backend depuis le navigateur.
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale : les DTO contrôlent les données avant l'entrée dans les controllers.
  app.useGlobalPipes(
    new ValidationPipe({
      // Retire les propriétés qui ne sont pas déclarées dans le DTO.
      whitelist: true,

      // Refuse la requête si elle contient un champ inconnu.
      forbidNonWhitelisted: true,

      // Autorise notamment class-transformer à convertir "65" en 65.
      transform: true,
    }),
  );

  // Les images enregistrées dans backend/uploads deviennent accessibles via /uploads/nom-fichier.
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Port du backend : valeur du .env, sinon 3001.
  const port = configService.get<number>('PORT') ?? 3001;

  // Configuration OpenAPI affichée dans Swagger.
  // Swagger documente l'authentification JWT mais ne remplace pas le JwtAuthGuard.
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

  // Documentation publique disponible sur http://localhost:3001/api-docs.
  SwaggerModule.setup('api-docs', app, document);

  // Démarre réellement le serveur HTTP.
  await app.listen(port);
}

bootstrap();
