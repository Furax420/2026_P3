// Pas besoin de mettre password dans ce DTO, la vérification du hash est faite dans /auth

export class UserResponseDto {
  id!: number;
  name!: string;
  email!: string;
  created_at!: Date | null;
  updated_at!: Date | null;
}
