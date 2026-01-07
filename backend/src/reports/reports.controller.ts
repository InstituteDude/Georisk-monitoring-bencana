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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto, UpdateReportStatusDto, FilterReportDto } from './dto';

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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    return this.reportsService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    return this.reportsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
