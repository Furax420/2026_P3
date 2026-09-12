import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    // Récupère la connexion MySQL depuis le fichier .env.
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');

    // Transforme la DATABASE_URL afin de fournir au driver les différentes informations de connexion séparément.
    const url = new URL(databaseUrl);

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      connectionLimit: 5,
      allowPublicKeyRetrieval: true,
    });

    // PrismaClient utilisera cet adapter pour communiquer avec MySQL.
    super({
      adapter,
    });
  }

  // Connexion à la base lors du démarrage du module.
  async onModuleInit() {
    await this.$connect();
  }

  // Ferme proprement la connexion lorsque le module est détruit.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
