import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Contient la logique métier de l'inscription, du login et de /auth/me.
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Vérifie que l'adresse email n'est pas déjà utilisée.
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // 2. Hash le mot de passe : le mot de passe en clair n'est jamais stocké.
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3. Crée l'utilisateur via UsersService -> UsersRepository -> Prisma.
    const user = await this.usersService.create(
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );

    // 4. Retourne immédiatement un JWT pour le nouvel utilisateur.
    return this.generateToken(user.id);
  }

  async login(loginDto: LoginDto) {
    // 1. Recherche l'utilisateur correspondant à l'adresse email.
    const user = await this.usersService.findByEmail(loginDto.email);

    // Même message pour email inconnu et mauvais mot de passe.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare le mot de passe reçu avec le hash enregistré en base.
    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Les identifiants sont valides : retourne le JWT.
    return this.generateToken(user.id);
  }

  // Centralise la création des JWT utilisés par register et login.
  private async generateToken(userId: number) {
    const token = await this.jwtService.signAsync({
      // sub = "subject" du JWT. On y place l'identifiant utilisateur.
      sub: userId,
    });

    return { token };
  }

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    // userId vient de request.user, lui-même construit par JwtStrategy.
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    // DTO de sortie manuel : le mot de passe n'est jamais renvoyé au frontend.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
