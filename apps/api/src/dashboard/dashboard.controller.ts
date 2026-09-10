import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma/client.js';

interface AuthUser {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
  mobileNo?: string;
  name?: string;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('citizen')
  @Roles(Role.PUBLIC_USER, Role.ADMIN)
  getCitizen(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getCitizenDashboard(user);
  }

  @Get('state')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER)
  getState(@CurrentUser() user: AuthUser, @Query('stateId') stateId?: string) {
    return this.dashboardService.getStateDashboard(user, stateId);
  }

  @Get('state/:stateId')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER)
  getStateById(@CurrentUser() user: AuthUser, @Param('stateId') stateId: string) {
    return this.dashboardService.getStateDashboard(user, stateId);
  }

  @Get('district')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  getDistrict(@CurrentUser() user: AuthUser, @Query('districtId') districtId?: string) {
    return this.dashboardService.getDistrictDashboard(user, districtId);
  }

  @Get('district/:districtId')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  getDistrictById(@CurrentUser() user: AuthUser, @Param('districtId') districtId: string) {
    return this.dashboardService.getDistrictDashboard(user, districtId);
  }

  @Get('national')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER)
  getNational() {
    return this.dashboardService.getNationalDashboard();
  }

  @Get('field')
  @Roles(Role.ADMIN, Role.FIELD_OFFICER)
  getField(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getFieldDashboard(user);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  getAdmin() {
    return this.dashboardService.getAdminDashboard();
  }
}
