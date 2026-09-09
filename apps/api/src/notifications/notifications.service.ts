import { Injectable } from '@nestjs/common';
import { NotificationStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, title: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
      select: { id: true },
    });

    if (!notification) {
      return null;
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
  }
}
