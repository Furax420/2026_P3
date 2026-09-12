import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  // Donne accès à PrismaService dans ce module.
  imports: [PrismaModule],

  // Services gérés par le module Users.
  providers: [UsersService, UsersRepository],

  // AuthModule aura besoin d'utiliser UsersService.
  exports: [UsersService],
})
export class UsersModule {}
