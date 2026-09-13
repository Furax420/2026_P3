import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

// Les routes User sont protégées par JWT et regroupées dans Swagger.
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/user/:id - route protégée automatiquement par le guard global.
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par son identifiant',
  })
  @ApiOkResponse({
    description: 'Utilisateur trouvé sans exposer son mot de passe.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Identifiant invalide.',
  })
  @ApiNotFoundResponse({
    description: 'Utilisateur introuvable.',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  findById(
    // ParseIntPipe transforme l'id de l'URL en number et refuse une valeur invalide.
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.getById(id);
  }
}
