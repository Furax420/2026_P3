import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Toutes les routes de l'API commenceront par /api.
  app.setGlobalPrefix('api');

  // Autorise le frontend React à appeler le backend.
  app.enableCors({
    origin: 'http://localhost:5174',
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

  const port = configService.get<number>('PORT') ?? 3001;

  await app.listen(port);
}

bootstrap();
