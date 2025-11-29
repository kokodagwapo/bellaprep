import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService, SendNotificationDto } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationType, NotificationChannel } from '@prisma/client';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('send')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Send a notification' })
  send(
    @Body() dto: SendNotificationDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.notificationService.send(tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'List all notifications (admin)' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('userId') userId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationService.findAll(tenantId, userId, +page, +limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my notifications' })
  findMyNotifications(
    @CurrentUser('sub') userId: string,
    @Query('unreadOnly') unreadOnly?: boolean,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationService.findUserNotifications(userId, unreadOnly, +page, +limit);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.notificationService.markAsRead(id, userId);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser('sub') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getPreferences(@CurrentUser('sub') userId: string) {
    return this.notificationService.getPreferences(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePreferences(
    @Body() preferences: any,
    @CurrentUser('sub') userId: string,
  ) {
    return this.notificationService.updatePreferences(userId, preferences);
  }

  // Templates
  @Get('templates')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'List notification templates' })
  getTemplates(@CurrentUser('tenantId') tenantId: string) {
    return this.notificationService.getTemplates(tenantId);
  }

  @Post('templates')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Create notification template' })
  createTemplate(
    @Body() data: {
      name: string;
      type: NotificationType;
      channels: NotificationChannel[];
      title: string;
      body: string;
    },
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.notificationService.createTemplate(tenantId, data);
  }

  @Patch('templates/:id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update notification template' })
  updateTemplate(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.notificationService.updateTemplate(id, tenantId, data);
  }

  @Delete('templates/:id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete notification template' })
  deleteTemplate(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.notificationService.deleteTemplate(id, tenantId);
  }

  @Post('templates/:id/send')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Send notification from template' })
  sendFromTemplate(
    @Param('id') templateId: string,
    @Body('userId') userId: string,
    @Body('variables') variables: Record<string, string>,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.notificationService.sendFromTemplate(tenantId, templateId, userId, variables);
  }
}

