import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';

// Module racine : il assemble tous les modules fonctionnels du backend.
@Module({
  imports: [
    // Charge le .env et rend ConfigService disponible dans toute l'application.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Centralise l'accès technique à MySQL avec Prisma.
    PrismaModule,

    // Gestion des utilisateurs utilisée notamment par l'authentification.
    UsersModule,

    // Register, login, JWT, stratégie Passport et guard global.
    AuthModule,

    // Lecture, création et modification des locations.
    RentalsModule,

    // Envoi et enregistrement des messages.
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
