import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

// Repository = couche qui parle directement à Prisma pour la table users.
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Utilisé par register/login pour retrouver un compte par son email unique.
  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  // Utilisé par /auth/me et GET /user/:id.
  findById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  // Enregistre un utilisateur. Le password reçu ici est déjà hashé par AuthService.
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
