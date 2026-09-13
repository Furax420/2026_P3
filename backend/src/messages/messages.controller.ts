import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

// Toute la partie Messages est regroupée et marquée comme protégée dans Swagger.
@ApiTags('Messages')
@ApiBearerAuth('access-token')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // POST /api/messages - route protégée automatiquement par le JwtAuthGuard global.
  @Post()
  @HttpCode(HttpStatus.OK) // Nest renvoie 201 par défaut pour POST, le contrat demande 200 ici.
  @ApiOperation({
    summary: 'Envoyer un message pour une location',
  })
  @ApiOkResponse({
    description: 'Message enregistré.',
    schema: {
      example: {
        message: 'Message sent!',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données invalides, location ou utilisateur inexistant.',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
}
