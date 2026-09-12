import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    // ParseInt remplace le "4" du json par un 4 int attendu par Prisma
    return this.rentalsService.findById(id);
  }
}
