import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('national')
  national() {
    return this.dashboardService.nationalSummary();
  }

  @Get('district/:id')
  district(@Param('id') id: string) {
    return this.dashboardService.districtSummary(id);
  }
}
