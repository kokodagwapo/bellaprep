import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

// Note: In production, use official Google Calendar / Microsoft Graph APIs

@Injectable()
export class CalendarService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getGoogleAuthUrl(tenantId: string, userId: string, redirectUri: string) {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar');
    
    const state = Buffer.from(JSON.stringify({ tenantId, userId })).toString('base64');
    
    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline`,
    };
  }

  async handleGoogleCallback(code: string, state: string, redirectUri: string) {
    const { tenantId, userId } = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // In production, exchange code for tokens via Google OAuth
    const tokens = {
      accessToken: `google-access-${Date.now()}`,
      refreshToken: `google-refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };

    await this.prisma.calendarConnection.upsert({
      where: {
        tenantId_userId_provider: { tenantId, userId, provider: 'GOOGLE' },
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        status: 'CONNECTED',
      },
      create: {
        tenantId,
        userId,
        provider: 'GOOGLE',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        status: 'CONNECTED',
      },
    });

    return { success: true };
  }

  async getMicrosoftAuthUrl(tenantId: string, userId: string, redirectUri: string) {
    const clientId = this.configService.get('MICROSOFT_CLIENT_ID');
    const scope = encodeURIComponent('Calendars.ReadWrite');
    
    const state = Buffer.from(JSON.stringify({ tenantId, userId })).toString('base64');
    
    return {
      url: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`,
    };
  }

  async getEvents(
    tenantId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const connection = await this.prisma.calendarConnection.findFirst({
      where: { tenantId, userId, status: 'CONNECTED' },
    });

    if (!connection) {
      throw new BadRequestException('No calendar connected');
    }

    // In production, fetch from Google Calendar / Microsoft Graph API
    // Return mock data for demonstration
    return {
      events: [
        {
          id: 'evt-1',
          title: 'Loan Application Review',
          start: new Date(startDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(startDate.getTime() + 24 * 60 * 60 * 1000 + 3600000).toISOString(),
          description: 'Review John Doe loan application',
        },
        {
          id: 'evt-2',
          title: 'Client Call',
          start: new Date(startDate.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          end: new Date(startDate.getTime() + 48 * 60 * 60 * 1000 + 1800000).toISOString(),
          description: 'Follow up with client',
        },
      ],
    };
  }

  async createEvent(
    tenantId: string,
    userId: string,
    event: {
      title: string;
      description?: string;
      start: Date;
      end: Date;
      attendees?: string[];
    },
  ) {
    const connection = await this.prisma.calendarConnection.findFirst({
      where: { tenantId, userId, status: 'CONNECTED' },
    });

    if (!connection) {
      throw new BadRequestException('No calendar connected');
    }

    // In production, create event via API
    return {
      id: `evt-${Date.now()}`,
      ...event,
      created: true,
    };
  }

  async deleteEvent(tenantId: string, userId: string, eventId: string) {
    const connection = await this.prisma.calendarConnection.findFirst({
      where: { tenantId, userId, status: 'CONNECTED' },
    });

    if (!connection) {
      throw new BadRequestException('No calendar connected');
    }

    // In production, delete via API
    return { deleted: true };
  }

  async disconnect(tenantId: string, userId: string, provider: 'GOOGLE' | 'MICROSOFT') {
    await this.prisma.calendarConnection.updateMany({
      where: { tenantId, userId, provider },
      data: { status: 'DISCONNECTED' },
    });

    return { success: true };
  }

  async getConnections(tenantId: string, userId: string) {
    return this.prisma.calendarConnection.findMany({
      where: { tenantId, userId },
      select: {
        provider: true,
        status: true,
        createdAt: true,
      },
    });
  }
}

