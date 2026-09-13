import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

// Champs texte/nombre attendus lors de POST /api/rentals.
// picture n'est pas ici : le fichier est géré séparément par Multer dans le controller.
export class CreateRentalDto {
  @ApiProperty({ example: 'Appartement Dijon' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  // FormData transmet les valeurs sous forme de chaînes : @Type les convertit en number.
  @ApiProperty({ example: 65 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  surface!: number;

  @ApiProperty({ example: 950 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({
    example: 'Appartement proche du centre',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;
}
