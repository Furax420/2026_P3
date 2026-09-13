import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesRepository } from './messages.repository';

// Vérifie les relations avant de demander au repository d'insérer le message.
@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async create(
    createMessageDto: CreateMessageDto,
  ): Promise<{ message: string }> {
    // Le message doit viser une location existante.
    const rental = await this.messagesRepository.findRentalById(
      createMessageDto.rental_id,
    );

    if (!rental) {
      throw new BadRequestException('Validation error');
    }

    // Le user_id fourni par le contrat doit lui aussi exister.
    const user = await this.messagesRepository.findUserById(
      createMessageDto.user_id,
    );

    if (!user) {
      throw new BadRequestException('Validation error');
    }

    // Les données sont valides : insertion réelle avec Prisma.
    await this.messagesRepository.create(
      createMessageDto.rental_id,
      createMessageDto.user_id,
      createMessageDto.message,
    );

    return {
      message: 'Message sent!',
    };
  }
}
