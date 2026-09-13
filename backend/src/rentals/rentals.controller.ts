import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { rentalPictureUploadOptions } from './rental-upload.config';
import { RentalsService } from './rentals.service';

// Express ne connaît pas par défaut la propriété user ajoutée par JwtStrategy.
type AuthenticatedRequest = Request & {
  user: {
    userId: number;
  };
};

// Toutes les routes Rentals sont protégées par JWT et regroupées dans Swagger.
@ApiTags('Rentals')
@ApiBearerAuth('access-token')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  // GET /api/rentals - récupère toutes les locations.
  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les locations',
  })
  @ApiOkResponse({
    description: 'Liste des locations.',
    schema: {
      type: 'object',
      properties: {
        rentals: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/RentalResponseDto',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  findAll() {
    return this.rentalsService.findAll();
  }

  // GET /api/rentals/:id - ParseIntPipe valide et convertit l'id de l'URL.
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une location',
  })
  @ApiOkResponse({
    description: 'Location trouvée.',
    type: RentalResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Location introuvable.',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  // POST /api/rentals - multipart/form-data car le formulaire contient une image.
  @Post()
  @ApiOperation({
    summary: 'Créer une location',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'surface', 'price', 'description', 'picture'],
      properties: {
        name: {
          type: 'string',
          example: 'Appartement Dijon',
        },
        surface: {
          type: 'number',
          example: 65,
        },
        price: {
          type: 'number',
          example: 950,
        },
        description: {
          type: 'string',
          example: 'Appartement proche du centre',
        },
        picture: {
          type: 'string',
          format: 'binary',
          description: 'Image JPEG, PNG ou WEBP - 5 Mo maximum',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Location créée.',
  })
  @ApiBadRequestResponse({
    description: 'Données invalides, image absente ou format non autorisé.',
  })
  @ApiResponse({
    status: 413,
    description: 'Image trop volumineuse (5 Mo maximum).',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  @UseInterceptors(FileInterceptor('picture', rentalPictureUploadOptions))
  create(
    // Champs texte/nombre du formulaire.
    @Body() createRentalDto: CreateRentalDto,

    // Fichier déjà traité par Multer avant l'exécution de la méthode.
    @UploadedFile() picture: Express.Multer.File | undefined,

    // Contient request.user.userId construit à partir du JWT.
    @Req() request: AuthenticatedRequest,
  ) {
    // L'image est obligatoire à la création.
    if (!picture) {
      throw new BadRequestException('Picture is required');
    }

    // La BDD stocke l'URL publique, pas le contenu binaire de l'image.
    const pictureUrl =
      `${request.protocol}://${request.get('host')}` +
      `/uploads/${picture.filename}`;

    // Le propriétaire vient du JWT et non d'un owner_id envoyé par le frontend.
    return this.rentalsService.create(
      createRentalDto,
      pictureUrl,
      request.user.userId,
    );
  }

  // PUT /api/rentals/:id - modification partielle, image facultative.
  @Put(':id')
  @ApiOperation({
    summary: 'Modifier une location',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Appartement modifié',
        },
        surface: {
          type: 'number',
          example: 70,
        },
        price: {
          type: 'number',
          example: 1100,
        },
        description: {
          type: 'string',
          example: 'Nouvelle description',
        },
        picture: {
          type: 'string',
          format: 'binary',
          description: 'Image JPEG, PNG ou WEBP - 5 Mo maximum',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Location modifiée.',
  })
  @ApiNotFoundResponse({
    description: 'Location introuvable.',
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou format d’image non autorisé.',
  })
  @ApiResponse({
    status: 413,
    description: 'Image trop volumineuse (5 Mo maximum).',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT absent ou invalide.',
  })
  @UseInterceptors(FileInterceptor('picture', rentalPictureUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalDto,
    @UploadedFile() picture: Express.Multer.File | undefined,
    @Req() request: AuthenticatedRequest,
  ) {
    // Sans nouvelle image, pictureUrl reste undefined et l'ancienne URL n'est pas modifiée.
    const pictureUrl = picture
      ? `${request.protocol}://${request.get('host')}/uploads/${picture.filename}`
      : undefined;

    return this.rentalsService.update(id, updateRentalDto, pictureUrl);
  }
}
