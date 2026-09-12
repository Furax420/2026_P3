import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Charge le fichier .env et rend ses variables disponibles dans toute l'application NestJS.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Module qui centralise l'accès à la base de données avec Prisma.
    PrismaModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
