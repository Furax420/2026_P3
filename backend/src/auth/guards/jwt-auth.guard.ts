import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Guard global : par défaut une route doit avoir un JWT valide.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Cherche la metadata posée par @Public() sur la route ou le controller.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Une route publique contourne volontairement la vérification JWT.
    if (isPublic) {
      return true;
    }

    // Sinon AuthGuard('jwt') déclenche JwtStrategy via Passport.
    return super.canActivate(context);
  }
}
