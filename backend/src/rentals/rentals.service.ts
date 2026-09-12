import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';

import { RentalResponseDto } from './dto/rental-response.dto';
import { RentalsRepository } from './rentals.repository';

type RentalWithOwner = Prisma.rentalsGetPayload<{
  include: {
    users: true;
  };
}>;

@Injectable()
export class RentalsService {
  constructor(private readonly rentalsRepository: RentalsRepository) {}

  async findAll(): Promise<{ rentals: RentalResponseDto[] }> {
    const rentals = await this.rentalsRepository.findAll();

    return {
      rentals: rentals.map((rental) => this.toResponseDto(rental)),
    };
  }

  async findById(id: number): Promise<RentalResponseDto> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    return this.toResponseDto(rental);
  }

  // Transforme la donnée Prisma en réponse adaptée au contrat de l'API.
  private toResponseDto(rental: RentalWithOwner): RentalResponseDto {
    return {
      id: rental.id,
      name: rental.name,
      surface: Number(rental.surface),
      price: Number(rental.price),
      picture: rental.picture ?? '',
      description: rental.description,
      owner: {
        id: rental.users.id,
        name: rental.users.name,
      },
      created_at: rental.created_at,
      updated_at: rental.updated_at,
    };
  }
}
