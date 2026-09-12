import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // Utiliser pour la route GET de l'accueil
    return this.prisma.rentals.findMany({
      include: {
        users: true,
      },
    });
  }

  findById(id: number) {
    // Utiliser pour les pages dynamiques de chaque location
    return this.prisma.rentals.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }
}
