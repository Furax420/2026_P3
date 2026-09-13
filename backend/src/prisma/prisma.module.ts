import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Rend PrismaService injectable dans les autres modules qui importent PrismaModule.
@Module({
  // Nest crée et gère l'instance de PrismaService.
  providers: [PrismaService],

  // Export nécessaire pour UsersModule, RentalsModule et MessagesModule.
  exports: [PrismaService],
})
export class PrismaModule {}
