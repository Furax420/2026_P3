import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

// Tous les champs sont facultatifs car PUT ne modifie que ce qui est envoyé.
// Une nouvelle picture reste gérée séparément par Multer.
export class UpdateRentalDto {
  @ApiPropertyOptional({ example: 'Appartement modifié' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  surface?: number;

  @ApiPropertyOptional({ example: 1100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    example: 'Nouvelle description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
