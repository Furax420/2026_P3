import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // Réponse de démonstration du starter NestJS.
  getHello(): string {
    return 'Hello World!';
  }

  // Test temporaire : si count() répond, Prisma communique bien avec MySQL.
  async checkDatabase() {
    const userCount = await this.prisma.users.count();

    return {
      database: 'connected',
      users: userCount,
    };
  }
}
