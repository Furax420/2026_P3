import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Recherche un utilisateur à partir de son email.
  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  // Recherche un utilisateur à partir de son identifiant.
  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  // Crée un utilisateur avec un mot de passe déjà hashé.
  create(name: string, email: string, password: string) {
    return this.usersRepository.create(name, email, password);
  }
  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ne retourne jamais le mot de passe.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
