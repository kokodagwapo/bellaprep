import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotificationType, NotificationChannel, NotificationStatus } from '@prisma/client';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

export interface SendNotificationDto {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  title: string;
  body: string;
  data?: any;
  loanId?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async send(tenantId: string, dto: SendNotificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const results: any[] = [];

    for (const channel of dto.channels) {
      const notification = await this.prisma.notification.create({
        data: {
          tenantId,
          userId: dto.userId,
          loanId: dto.loanId,
          type: dto.type,
          channel,
          title: dto.title,
          body: dto.body,
          data: dto.data || {},
          status: NotificationStatus.PENDING,
        },
      });

      try {
        switch (channel) {
          case NotificationChannel.EMAIL:
            await this.emailService.send({
              to: user.email,
              subject: dto.title,
              html: dto.body,
              data: dto.data,
            });
            break;

          case NotificationChannel.SMS:
            if (user.phone) {
              await this.smsService.send({
                to: user.phone,
                body: dto.body,
              });
            }
            break;

          case NotificationChannel.IN_APP:
            // In-app notifications are just stored in DB
            break;

          case NotificationChannel.PUSH:
            // Push notifications would go to FCM/APNs
            break;
        }

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { 
            status: NotificationStatus.SENT,
            sentAt: new Date(),
          },
        });

        results.push({ channel, status: 'sent', notificationId: notification.id });
      } catch (error) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { 
            status: NotificationStatus.FAILED,
            error: error.message,
          },
        });

        results.push({ channel, status: 'failed', error: error.message });
      }
    }

    return results;
  }

  async findAll(tenantId: string, userId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (userId) where.userId = userId;

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUserNotifications(userId: string, unreadOnly = false, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = { 
      userId,
      channel: NotificationChannel.IN_APP,
    };
    if (unreadOnly) where.readAt = null;

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, channel: NotificationChannel.IN_APP, readAt: null },
      }),
    ]);

    return {
      items,
      total,
      unreadCount,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });

    return user?.notificationPreferences || {
      email: true,
      sms: true,
      inApp: true,
      push: true,
      types: {},
    };
  }

  async updatePreferences(userId: string, preferences: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: preferences },
      select: { notificationPreferences: true },
    });
  }

  // Template-based notifications
  async sendFromTemplate(
    tenantId: string,
    templateId: string,
    userId: string,
    variables: Record<string, string>,
  ) {
    const template = await this.prisma.notificationTemplate.findFirst({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    let title = template.title;
    let body = template.body;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      title = title.replace(new RegExp(`{{${key}}}`, 'g'), value);
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return this.send(tenantId, {
      userId,
      type: template.type,
      channels: template.channels as NotificationChannel[],
      title,
      body,
    });
  }

  // Notification templates
  async createTemplate(tenantId: string, data: {
    name: string;
    type: NotificationType;
    channels: NotificationChannel[];
    title: string;
    body: string;
  }) {
    return this.prisma.notificationTemplate.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async getTemplates(tenantId: string) {
    return this.prisma.notificationTemplate.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async updateTemplate(id: string, tenantId: string, data: any) {
    return this.prisma.notificationTemplate.updateMany({
      where: { id, tenantId },
      data,
    });
  }

  async deleteTemplate(id: string, tenantId: string) {
    return this.prisma.notificationTemplate.deleteMany({
      where: { id, tenantId },
    });
  }
}

