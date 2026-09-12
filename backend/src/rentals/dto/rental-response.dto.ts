export class RentalOwnerDto {
  id!: number;
  name!: string;
}

export class RentalResponseDto {
  id!: number;
  name!: string;
  surface!: number;
  price!: number;
  picture!: string;
  description!: string;
  owner!: RentalOwnerDto;
  created_at!: Date | null;
  updated_at!: Date | null;
}
