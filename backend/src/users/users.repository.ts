import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable() // Rend la classe injectable ailleurs
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {} // Connecte à la base via PrismaService

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  findById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  create(name: string, email: string, password: string) {
    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
