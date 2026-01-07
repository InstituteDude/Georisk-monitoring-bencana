import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvacuationPointDto, UpdateEvacuationPointDto } from './dto';

@Injectable()
export class EvacuationService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly: boolean = true) {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.evacuationPoint.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const point = await this.prisma.evacuationPoint.findUnique({ where: { id } });
    if (!point) {
      throw new NotFoundException(`Evacuation point with ID ${id} not found`);
    }
    return point;
  }

  async create(dto: CreateEvacuationPointDto) {
    return this.prisma.evacuationPoint.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateEvacuationPointDto) {
    await this.findOne(id);
    return this.prisma.evacuationPoint.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.evacuationPoint.delete({ where: { id } });
  }

  // Get as GeoJSON for map display
  async getAsGeoJSON() {
    const points = await this.prisma.evacuationPoint.findMany({
      where: { isActive: true },
    });

    return {
      type: 'FeatureCollection',
      features: points.map((point) => ({
        type: 'Feature',
        id: point.id,
        properties: {
          name: point.name,
          address: point.address,
          capacity: point.capacity,
          facilities: point.facilities,
          phone: point.phone,
        },
        geometry: {
          type: 'Point',
          coordinates: [point.longitude, point.latitude],
        },
      })),
    };
  }

  async getStatistics() {
    const [total, totalCapacity] = await Promise.all([
      this.prisma.evacuationPoint.count({ where: { isActive: true } }),
      this.prisma.evacuationPoint.aggregate({
        where: { isActive: true },
        _sum: { capacity: true },
      }),
    ]);

    return {
      total,
      totalCapacity: totalCapacity._sum.capacity || 0,
    };
  }
}
