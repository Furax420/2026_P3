import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { RentalsController } from './rentals.controller';
import { RentalsRepository } from './rentals.repository';
import { RentalsService } from './rentals.service';

// Assemble la chaîne Controller -> Service -> Repository pour les locations.
@Module({
  imports: [PrismaModule],
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository],
})
export class RentalsModule {}
