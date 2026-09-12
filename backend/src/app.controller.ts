import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route temporaire de vérification de la connexion à la base.
  @Get('db-test')
  checkDatabase() {
    return this.appService.checkDatabase();
  }
}
