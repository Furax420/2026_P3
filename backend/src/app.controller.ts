import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controller technique créé avec le projet NestJS.
// Les routes métier sont séparées dans auth/, rentals/, users/ et messages/.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Route racine de démonstration du starter NestJS.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route temporaire utilisée pour vérifier la connexion NestJS -> Prisma -> MySQL.
  @Get('db-test')
  checkDatabase() {
    return this.appService.checkDatabase();
  }
}
