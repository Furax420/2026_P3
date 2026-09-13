import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
  })
  id!: number;

  @ApiProperty({
    example: 'Tristan',
  })
  name!: string;

  @ApiProperty({
    example: 'tristan@example.com',
  })
  email!: string;

  @ApiProperty({
    example: '2026-09-13T10:00:00.000Z',
    nullable: true,
  })
  created_at!: Date | null;

  @ApiProperty({
    example: '2026-09-13T10:00:00.000Z',
    nullable: true,
  })
  updated_at!: Date | null;
}
