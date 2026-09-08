import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, title: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, title, message, status: NotificationStatus.PENDING },
    });
  }

  findForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
  }
}
