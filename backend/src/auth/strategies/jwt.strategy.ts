import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Récupère le token dans :
      // Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Un token expiré sera refusé.
      ignoreExpiration: false,

      // Secret utilisé pour vérifier que le token est authentique.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Appelé automatiquement après validation du JWT.
  validate(payload: { sub: number }) {
    return {
      userId: payload.sub,
    };
  }
}
