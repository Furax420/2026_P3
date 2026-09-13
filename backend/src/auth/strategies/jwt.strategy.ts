import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Explique à Passport comment extraire et vérifier un JWT reçu par l'API.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Lit le header : Authorization: Bearer <token>.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Un token expiré est refusé.
      ignoreExpiration: false,

      // Vérifie la signature avec le même secret que celui utilisé à la création.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Appelé automatiquement une fois le token validé.
  validate(payload: { sub: number }) {
    // Ce retour devient request.user dans les controllers.
    return {
      userId: payload.sub,
    };
  }
}
