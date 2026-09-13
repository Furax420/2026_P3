import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import { diskStorage } from 'multer';

// Formats d'image acceptés pour les locations.
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Taille maximale d'une image : 5 Mo.
const MAX_PICTURE_SIZE = 5 * 1024 * 1024;

// Associe le type MIME à une extension maîtrisée côté serveur.
const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// Configuration Multer réutilisée par la création et la modification d'une location.
export const rentalPictureUploadOptions = {
  storage: diskStorage({
    // Les images sont enregistrées physiquement dans backend/uploads.
    destination: 'uploads',

    filename: (
      _request: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      // UUID évite les collisions de noms entre plusieurs fichiers.
      // L'extension dépend du type MIME validé et non du nom envoyé par le client.
      const extension = MIME_EXTENSIONS[file.mimetype];
      callback(null, `${randomUUID()}${extension}`);
    },
  }),

  // Empêche l'envoi de fichiers trop volumineux.
  limits: {
    fileSize: MAX_PICTURE_SIZE,
  },

  // Refuse les fichiers qui ne sont pas des images autorisées.
  fileFilter: (
    _request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          'Only JPEG, PNG and WEBP images are allowed',
        ),
        false,
      );
    }

    callback(null, true);
  },
};
