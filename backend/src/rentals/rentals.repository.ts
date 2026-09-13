import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

// Forme des champs que Prisma peut recevoir lors d'une modification partielle.
type UpdateRentalData = {
  name?: string;
  surface?: number;
  price?: number;
  picture?: string;
  description?: string;
};

// Repository = seul endroit du module Rentals qui exécute directement les requêtes Prisma.
@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Récupère toutes les locations avec l'utilisateur propriétaire associé.
  findAll() {
    return this.prisma.rentals.findMany({
      include: {
        users: true,
      },
    });
  }

  // Récupère une location précise avec son propriétaire.
  findById(id: number) {
    return this.prisma.rentals.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  // Crée une location et la rattache à l'utilisateur connecté.
  create(
    name: string,
    surface: number,
    price: number,
    picture: string,
    description: string,
    ownerId: number,
  ) {
    return this.prisma.rentals.create({
      data: {
        name,
        surface,
        price,
        picture,
        description,

        // Prisma remplit owner_id grâce à la relation users -> id.
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

  // Prisma ne modifie que les propriétés réellement présentes dans data.
  update(id: number, data: UpdateRentalData) {
    return this.prisma.rentals.update({
      where: { id },
      data,
      include: {
        users: true,
      },
    });
  }
}
