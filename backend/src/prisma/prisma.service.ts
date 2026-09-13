import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../generated/prisma/client';

// Encapsule PrismaClient pour avoir un seul point d'accès à la base dans NestJS.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    // Récupère la chaîne de connexion MySQL depuis le .env.
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');

    // Sépare la DATABASE_URL en host, port, user, password et nom de base.
    const url = new URL(databaseUrl);

    // Prisma 7 utilise ici l'adapter MariaDB pour communiquer avec MySQL.
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      connectionLimit: 5,

      // Nécessaire avec l'authentification MySQL locale utilisée par le projet.
      allowPublicKeyRetrieval: true,
    });

    // Le PrismaClient hérité utilisera cet adapter pour toutes ses requêtes.
    super({
      adapter,
    });
  }

  // Ouvre la connexion lorsque Nest initialise le module.
  async onModuleInit() {
    await this.$connect();
  }

  // Ferme proprement la connexion lorsque Nest s'arrête.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
