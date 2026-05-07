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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { EvacuationService } from './evacuation.service';
import { CreateEvacuationPointDto, UpdateEvacuationPointDto } from './dto';
import { RolesGuard, Roles } from '../auth/guards';

@Controller('evacuation')
export class EvacuationController {
  constructor(private readonly evacuationService: EvacuationService) {}

  @Get()
  findAll(@Query('activeOnly') activeOnly?: string) {
    const active = activeOnly !== 'false';
    return this.evacuationService.findAll(active);
  }

  @Get('geojson')
  getAsGeoJSON() {
    return this.evacuationService.getAsGeoJSON();
  }

  @Get('statistics')
  getStatistics() {
    return this.evacuationService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evacuationService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEvacuationPointDto) {
    return this.evacuationService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateEvacuationPointDto) {
    return this.evacuationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.evacuationService.remove(id);
  }
}

