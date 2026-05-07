import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseEnumPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  getAsGeoJSON(@Query('type') type?: DisasterType) {
    return this.disastersService.getAsGeoJSON(type);
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

