import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Décrit et valide le JSON attendu par POST /api/auth/register.
export class RegisterDto {
  @ApiProperty({
    example: 'Tristan',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'tristan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'motdepasse',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
