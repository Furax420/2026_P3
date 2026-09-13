import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';

import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalsRepository } from './rentals.repository';

// Type Prisma exact d'une rental avec uniquement id et name du propriétaire.
type RentalWithOwner = Prisma.rentalsGetPayload<{
  include: {
    users: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

// Logique métier des locations. Le service ne fait pas directement de requête Prisma.
@Injectable()
export class RentalsService {
  constructor(private readonly rentalsRepository: RentalsRepository) {}

  async findAll(): Promise<{ rentals: RentalResponseDto[] }> {
    const rentals = await this.rentalsRepository.findAll();

    // Adapte chaque résultat Prisma au contrat attendu par le frontend.
    return {
      rentals: rentals.map((rental) => this.toResponseDto(rental)),
    };
  }

  async findById(id: number): Promise<RentalResponseDto> {
    const rental = await this.rentalsRepository.findById(id);

    // Une ressource demandée qui n'existe pas renvoie un vrai 404 HTTP.
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
    // Le controller fournit le DTO, l'URL générée et l'id extrait du JWT.
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
    // Vérifie d'abord l'existence pour retourner un 404 clair si nécessaire.
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    // Le DTO contient uniquement les champs envoyés.
    // picture n'est ajouté que si une nouvelle image a réellement été uploadée.
    const data = {
      ...updateRentalDto,
      ...(pictureUrl ? { picture: pictureUrl } : {}),
    };

    await this.rentalsRepository.update(id, data);

    return {
      message: 'Rental updated!',
    };
  }

  // Transforme la structure Prisma en structure publique attendue par React.
  private toResponseDto(rental: RentalWithOwner): RentalResponseDto {
    return {
      id: rental.id,
      name: rental.name,

      // Les DECIMAL MySQL de Prisma deviennent des number JavaScript.
      surface: Number(rental.surface),
      price: Number(rental.price),

      picture: rental.picture ?? '',
      description: rental.description,

      // La relation Prisma s'appelle users mais le contrat API attend owner.
      owner: {
        id: rental.users.id,
        name: rental.users.name,
      },
      created_at: rental.created_at,
      updated_at: rental.updated_at,
    };
  }
}
