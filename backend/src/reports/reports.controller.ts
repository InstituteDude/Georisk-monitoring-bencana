import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto, UpdateReportStatusDto, FilterReportDto } from './dto';
import { RolesGuard, Roles } from '../auth/guards';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@Query() filter: FilterReportDto) {
    return this.reportsService.findAll(filter);
  }

  @Get('geojson')
  getAsGeoJSON() {
    return this.reportsService.getAsGeoJSON();
  }

  @Get('statistics')
  getStatistics() {
    return this.reportsService.getStatistics();
  }

  @Get('recent')
  getRecent(@Query('hours') hours?: string) {
    return this.reportsService.getRecent(hours ? parseInt(hours) : 24);
  }

  @Get('pending/count')
  getPendingCount() {
    return this.reportsService.countPending();
  }

  @Get('stats/by-type')
  getStatsByType() {
    return this.reportsService.getStatsByType();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreateReportDto) {
    return this.reportsService.create(dto, req.user?.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    return this.reportsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}

