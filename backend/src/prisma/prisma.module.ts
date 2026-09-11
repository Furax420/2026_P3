import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // PrismaService peut être injecté dans les classes de ce module.
  providers: [PrismaService],

  // On l'exporte pour pouvoir aussi l'utiliser dans les autres modules de l'application.
  exports: [PrismaService],
})
export class PrismaModule {}
