import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

// Accès Prisma utilisé uniquement par le module Messages.
@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Vérifie qu'une rental existe sans charger toutes ses colonnes.
  findRentalById(id: number) {
    return this.prisma.rentals.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  // Vérifie qu'un utilisateur existe sans récupérer son password.
  findUserById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  // Insère le message et ses deux clés étrangères dans la table messages.
  create(rentalId: number, userId: number, message: string) {
    return this.prisma.messages.create({
      data: {
        rental_id: rentalId,
        user_id: userId,
        message,
      },
    });
  }
}
