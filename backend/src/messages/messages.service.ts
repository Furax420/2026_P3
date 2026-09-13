import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async create(
    createMessageDto: CreateMessageDto,
  ): Promise<{ message: string }> {
    const rental = await this.messagesRepository.findRentalById(
      createMessageDto.rental_id,
    );

    if (!rental) {
      throw new BadRequestException('Validation error');
    }

    const user = await this.messagesRepository.findUserById(
      createMessageDto.user_id,
    );

    if (!user) {
      throw new BadRequestException('Validation error');
    }

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
