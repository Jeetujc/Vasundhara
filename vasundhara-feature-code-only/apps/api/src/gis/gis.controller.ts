import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GisService } from './gis.service.js';

@Controller('gis')
@UseGuards(JwtAuthGuard)
export class GisController {
  constructor(private readonly gisService: GisService) {}

  @Get('projects/:projectId/parcels.geojson')
  parcelsGeoJson(@Param('projectId') projectId: string) {
    return this.gisService.getProjectFeatureCollection(projectId);
  }
}
