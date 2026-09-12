import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Test temporaire pour vérifier l'accès à MySQL depuis NestJS.
  async checkDatabase() {
    const userCount = await this.prisma.users.count();

    return {
      database: 'connected',
      users: userCount,
    };
  }
}
