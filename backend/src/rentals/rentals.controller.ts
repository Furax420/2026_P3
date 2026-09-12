import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalsService } from './rentals.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
  };
};

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: 'uploads',

        filename: (_request, file, callback) => {
          // Génère un nom unique en conservant l'extension du fichier.
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),
    }),
  )
  create(
    @Body() createRentalDto: CreateRentalDto,
    @UploadedFile() picture: Express.Multer.File | undefined,
    @Req() request: AuthenticatedRequest,
  ) {
    if (!picture) {
      throw new BadRequestException('Picture is required');
    }

    // Construit l'URL qui sera enregistrée dans la base.
    const pictureUrl =
      `${request.protocol}://${request.get('host')}` +
      `/uploads/${picture.filename}`;

    return this.rentalsService.create(
      createRentalDto,
      pictureUrl,
      request.user.userId,
    );
  }
}
