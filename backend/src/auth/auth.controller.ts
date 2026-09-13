import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Les décorateurs @Api... servent uniquement à la documentation Swagger.
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register : seule la validation du DTO arrive avant cette méthode.
  @Post('register')
  @Public() // Exception au guard JWT global : inscription accessible sans token.
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Créer un compte utilisateur',
  })
  @ApiOkResponse({
    description: 'Compte créé et JWT retourné.',
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou adresse email déjà utilisée.',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // POST /api/auth/login : vérifie les identifiants puis retourne un JWT.
  @Post('login')
  @Public() // Exception au guard JWT global : login accessible sans token.
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connecter un utilisateur',
  })
  @ApiOkResponse({
    description: 'Authentification réussie et JWT retourné.',
  })
  @ApiUnauthorizedResponse({
    description: 'Identifiants incorrects.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /api/auth/me : request.user a été rempli par JwtStrategy après validation du token.
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Récupérer l'utilisateur connecté",
  })
  @ApiOkResponse({
    description: "Informations de l'utilisateur connecté.",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  getCurrentUser(@Req() request: { user: { userId: number } }) {
    return this.authService.getCurrentUser(request.user.userId);
  }
}
