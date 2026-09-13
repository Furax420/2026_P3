import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

// JSON attendu par POST /api/messages.
export class CreateMessageDto {
  // Location concernée par le message.
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  rental_id!: number;

  // Utilisateur indiqué par le contrat du frontend.
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  user_id!: number;

  @ApiProperty({
    example: 'Bonjour, cette location est-elle toujours disponible ?',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
