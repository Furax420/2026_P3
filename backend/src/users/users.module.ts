import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  // Donne accès à PrismaService dans UsersRepository.
  imports: [PrismaModule],

  controllers: [UsersController],

  // Nest crée et injecte ces deux classes quand elles sont demandées.
  providers: [UsersService, UsersRepository],

  // AuthModule importe UsersModule et peut ainsi injecter UsersService.
  exports: [UsersService],
})
export class UsersModule {}
