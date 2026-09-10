import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GisService } from './gis.service.js';

@Controller('gis')
export class GisController {
  constructor(private readonly gisService: GisService) {}

  @Get('projects')
  async getProjects() {
    return this.gisService.getProjectsSpatial();
  }

  @Get('parcels')
  async getParcels(
    @Query('projectId') projectId?: string,
    @Query('village') village?: string,
    @Query('status') status?: string,
  ) {
    return this.gisService.getParcelsGeoJson(projectId, village, status);
  }

  @Get('parcels/:parcelId')
  async getParcelDetail(@Param('parcelId') parcelId: string) {
    return this.gisService.getParcelSpatial(parcelId);
  }

  @Post('parcels/:parcelId/boundary')
  async saveBoundary(
    @Param('parcelId') parcelId: string,
    @Body()
    body: {
      coordinates?: number[][];
      latitude?: number;
      longitude?: number;
      remarks?: string;
    },
  ) {
    return this.gisService.saveParcelBoundary(parcelId, body);
  }

  @Get('layers')
  getLayers() {
    return this.gisService.getLayers();
  }

  @Get('stats')
  async getStats() {
    return this.gisService.getGisStats();
  }
}
