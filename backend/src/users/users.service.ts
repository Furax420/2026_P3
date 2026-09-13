import { Injectable, NotFoundException } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';

// Couche métier utilisateur placée entre les controllers/services et Prisma.
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Recherche un utilisateur par email sans accéder à Prisma depuis AuthService.
  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  // Recherche interne par identifiant, notamment utilisée par /auth/me.
  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  // AuthService fournit déjà un mot de passe hashé avant d'appeler cette méthode.
  create(name: string, email: string, password: string) {
    return this.usersRepository.create(name, email, password);
  }

  // Méthode dédiée à GET /api/user/:id avec gestion du 404 et DTO de sortie.
  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ne retourne volontairement jamais user.password.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
