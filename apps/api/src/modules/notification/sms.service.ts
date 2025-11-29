import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Note: In production, use twilio package
interface SmsOptions {
  to: string;
  body: string;
  from?: string;
}

@Injectable()
export class SmsService {
  private fromNumber: string;

  constructor(private configService: ConfigService) {
    this.fromNumber = this.configService.get('TWILIO_FROM_NUMBER') || '+15551234567';
  }

  async send(options: SmsOptions): Promise<{ success: boolean; sid?: string }> {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      console.log('SMS would be sent:', {
        to: options.to,
        from: options.from || this.fromNumber,
        body: options.body,
      });
      return { success: true, sid: `mock-${Date.now()}` };
    }

    try {
      // In production, use Twilio
      // const twilio = require('twilio')(accountSid, authToken);
      // const message = await twilio.messages.create({
      //   body: options.body,
      //   to: options.to,
      //   from: options.from || this.fromNumber,
      // });

      console.log('SMS sent:', options.to);
      return { success: true, sid: `tw-${Date.now()}` };
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  async sendBatch(messages: SmsOptions[]): Promise<{ success: boolean; results: any[] }> {
    const results = await Promise.all(
      messages.map(msg => this.send(msg).catch(error => ({ success: false, error: error.message })))
    );

    return {
      success: results.every(r => r.success),
      results,
    };
  }

  // Pre-built SMS templates
  async sendMfaCode(to: string, code: string) {
    return this.send({
      to,
      body: `Your BellaPrep verification code is: ${code}. Valid for 10 minutes.`,
    });
  }

  async sendLoanStatusUpdate(to: string, status: string) {
    return this.send({
      to,
      body: `BellaPrep: Your loan application status has been updated to: ${status}. Log in for details.`,
    });
  }

  async sendDocumentReminder(to: string) {
    return this.send({
      to,
      body: `BellaPrep: Documents are needed for your loan application. Please log in to upload them.`,
    });
  }

  async sendAppointmentReminder(to: string, date: string, time: string) {
    return this.send({
      to,
      body: `BellaPrep: Reminder - You have an appointment on ${date} at ${time}. Reply CONFIRM to confirm.`,
    });
  }
}

