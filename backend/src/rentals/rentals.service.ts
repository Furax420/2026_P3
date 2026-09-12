import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';

import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { RentalsRepository } from './rentals.repository';
import { UpdateRentalDto } from './dto/update-rental.dto';

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

  async create(
    createRentalDto: CreateRentalDto,
    pictureUrl: string,
    ownerId: number,
  ): Promise<{ message: string }> {
    await this.rentalsRepository.create(
      createRentalDto.name,
      createRentalDto.surface,
      createRentalDto.price,
      pictureUrl,
      createRentalDto.description,
      ownerId,
    );

    return {
      message: 'Rental created!',
    };
  }

  async update(
    id: number,
    updateRentalDto: UpdateRentalDto,
    pictureUrl?: string,
  ): Promise<{ message: string }> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    const data = {
      ...updateRentalDto,
      ...(pictureUrl ? { picture: pictureUrl } : {}),
    };

    await this.rentalsRepository.update(id, data);

    return {
      message: 'Rental updated!',
    };
  }

  // Transforme la donnée Prisma vers le format attendu par le frontend.
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
