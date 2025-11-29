import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY') || '');

    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const msg = {
      to,
      from: this.configService.get('SENDGRID_FROM_EMAIL') || 'noreply@bellaprep.com',
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(to: string, message: string) {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to,
      });

      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }
}

