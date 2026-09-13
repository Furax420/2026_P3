import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRentalById(id: number) {
    return this.prisma.rentals.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  findUserById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }

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
