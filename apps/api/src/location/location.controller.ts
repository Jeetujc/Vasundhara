import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service.js';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('states')
  getStates() {
    return this.locationsService.getStates();
  }

  @Get('states/:stateId/districts')
  getDistricts(@Param('stateId') stateId: string) {
    return this.locationsService.getDistricts(stateId);
  }

  @Get('districts/:districtId/tehsils')
  getTehsils(@Param('districtId') districtId: string) {
    return this.locationsService.getTehsils(districtId);
  }
}