import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Décrit et valide le JSON attendu par POST /api/auth/login.
export class LoginDto {
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
