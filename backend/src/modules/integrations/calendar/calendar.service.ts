import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  constructor(private configService: ConfigService) {}

  async getAuthUrl(tenantId: string, redirectUri: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri,
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: tenantId,
    });

    return { authUrl: url };
  }

  async handleCallback(code: string, tenantId: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in database (via Integration model)
    return { success: true, tokens };
  }

  async createAppointment(
    accessToken: string,
    summary: string,
    startTime: Date,
    endTime: Date,
    attendeeEmail?: string,
  ) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        ...(attendeeEmail && {
          attendees: [{ email: attendeeEmail }],
        }),
      },
    });

    return event.data;
  }

  async getUpcomingAppointments(accessToken: string, maxResults: number = 10) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }
}

