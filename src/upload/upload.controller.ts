// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorators';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rasm yuklash (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 32 * 1024 * 1024 }, // 32MB
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          cb(new Error('Faqat rasm fayllari!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
}
