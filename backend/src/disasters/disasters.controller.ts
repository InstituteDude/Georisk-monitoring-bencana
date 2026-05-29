import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  ParseEnumPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { DisasterType, Role } from '@prisma/client';
import { DisastersService } from './disasters.service';
import { CreateDisasterZoneDto, UpdateDisasterZoneDto, FilterDisasterZoneDto } from './dto';
import { RolesGuard, Roles } from '../auth/guards';

@Controller('disasters')
export class DisastersController {
  constructor(private readonly disastersService: DisastersService) {}

  @Get()
  findAll(@Query() filter: FilterDisasterZoneDto) {
    return this.disastersService.findAll(filter);
  }

  @Get('identify')
  identify(@Query('lat') lat: string, @Query('lng') lng: string) {
    if (!lat || !lng) {
      return null;
    }
    return this.disastersService.identify(parseFloat(lat), parseFloat(lng));
  }

  @Get('geojson')
  getAsGeoJSON(
    @Query('type') type?: DisasterType,
    @Query('minLat') minLat?: string,
    @Query('maxLat') maxLat?: string,
    @Query('minLng') minLng?: string,
    @Query('maxLng') maxLng?: string,
  ) {
    const bbox = minLat && maxLat && minLng && maxLng
      ? { minLat: +minLat, maxLat: +maxLat, minLng: +minLng, maxLng: +maxLng }
      : undefined;
    return this.disastersService.getAsGeoJSON(type, bbox);
  }

  @Get('statistics')
  getStatistics() {
    return this.disastersService.getStatistics();
  }

  @Get('type/:type')
  findByType(
    @Param('type', new ParseEnumPipe(DisasterType)) type: DisasterType,
  ) {
    return this.disastersService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disastersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDisasterZoneDto) {
    return this.disastersService.create(dto);
  }

  @Post('analyze')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 300 * 1024 * 1024 } }))
  analyze(
    @UploadedFile() file: Express.Multer.File,
    @Body('defaultType') defaultType?: string,
  ) {
    return this.disastersService.analyzeGeoJSON(file.buffer, defaultType);
  }

  @Post('import')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 300 * 1024 * 1024 } }))
  import(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type?: DisasterType,
    @Body('clearExisting') clearExisting?: string,
  ) {
    return this.disastersService.importGeoJSON(
      file.buffer,
      type,
      clearExisting === 'true',
    );
  }

  @Post('import-stream')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 300 * 1024 * 1024 } }))
  async importStream(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: DisasterType,
    @Body('clearExisting') clearExisting: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

    try {
      await this.disastersService.importGeoJSONWithProgress(
        file.buffer,
        type,
        clearExisting === 'true',
        send,
      );
    } catch {
      // error already sent inside the service
    } finally {
      res.end();
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateDisasterZoneDto) {
    return this.disastersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.disastersService.remove(id);
  }
}

