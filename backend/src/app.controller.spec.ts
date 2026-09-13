import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Test unitaire généré avec le projet NestJS.
// Il vérifie ici uniquement la route racine de démonstration.
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    // Crée un petit module Nest isolé pour le test.
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
