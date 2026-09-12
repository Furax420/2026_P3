import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    // Utilisé pour la route GET de l'accueil.
    return this.prisma.rentals.findMany({
      include: {
        users: true,
      },
    });
  }

  findById(id: number) {
    // Utilisé pour les pages dynamiques de chaque location.
    return this.prisma.rentals.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  create(
    name: string,
    surface: number,
    price: number,
    picture: string,
    description: string,
    ownerId: number,
  ) {
    // Crée une location et la rattache à l'utilisateur connecté.
    return this.prisma.rentals.create({
      data: {
        name,
        surface,
        price,
        picture,
        description,
        users: {
          connect: {
            id: ownerId,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }
}
