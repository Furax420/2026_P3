import { ApiProperty } from '@nestjs/swagger';

// Petit DTO imbriqué correspondant à l'objet owner attendu par le frontend.
export class RentalOwnerDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Tristan' })
  name!: string;
}

// Forme publique renvoyée par GET /rentals et GET /rentals/:id.
// Elle évite d'exposer directement la structure Prisma et le owner_id brut.
export class RentalResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Appartement Dijon' })
  name!: string;

  @ApiProperty({ example: 65 })
  surface!: number;

  @ApiProperty({ example: 950 })
  price!: number;

  @ApiProperty({
    example: 'http://localhost:3001/uploads/image.png',
  })
  picture!: string;

  @ApiProperty({
    example: 'Appartement proche du centre',
  })
  description!: string;

  @ApiProperty({ type: RentalOwnerDto })
  owner!: RentalOwnerDto;

  @ApiProperty({ nullable: true })
  created_at!: Date | null;

  @ApiProperty({ nullable: true })
  updated_at!: Date | null;
}
