import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { NotificationsService } from './notifications.service.js';

interface AuthUser {
  id: string;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  listMine(@CurrentUser() user: AuthUser) {
    return this.notificationsService.listForUser(user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}
