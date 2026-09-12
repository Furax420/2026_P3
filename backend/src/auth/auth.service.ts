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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Vérifie que l'adresse email n'est pas déjà utilisée.
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Le mot de passe n'est jamais enregistré en clair.
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create(
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );

    return this.generateToken(user.id);
  }

  async login(loginDto: LoginDto) {
    // Recherche l'utilisateur correspondant à l'adresse email.
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare le mot de passe reçu avec le hash enregistré en base.
    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id);
  }

  // Centralise la création des JWT utilisés par register et login.
  private async generateToken(userId: number) {
    const token = await this.jwtService.signAsync({
      sub: userId,
    });

    return { token };
  }

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
