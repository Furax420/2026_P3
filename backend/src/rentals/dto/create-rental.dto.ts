import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // Les valeurs FormData arrivent sous forme de chaînes.
  // @Type permet de les convertir en number avant validation.
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  surface!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
