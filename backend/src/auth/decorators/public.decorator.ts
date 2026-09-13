import { SetMetadata } from '@nestjs/common';

// Clé de metadata recherchée ensuite par JwtAuthGuard avec Reflector.
export const IS_PUBLIC_KEY = 'isPublic';

// Marque explicitement une route comme accessible sans authentification JWT.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
