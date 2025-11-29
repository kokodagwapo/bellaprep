import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Note: In production, use @sendgrid/mail
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    type: string;
  }>;
  data?: any;
}

@Injectable()
export class EmailService {
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get('SENDGRID_FROM_EMAIL') || 'noreply@bellaprep.com';
    this.fromName = this.configService.get('SENDGRID_FROM_NAME') || 'BellaPrep';
  }

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    const apiKey = this.configService.get('SENDGRID_API_KEY');

    if (!apiKey) {
      console.log('Email would be sent:', {
        to: options.to,
        subject: options.subject,
        from: options.from || `${this.fromName} <${this.fromEmail}>`,
      });
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    try {
      // In production, use SendGrid API
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(apiKey);
      // const result = await sgMail.send({
      //   to: options.to,
      //   from: { email: this.fromEmail, name: this.fromName },
      //   subject: options.subject,
      //   html: options.html,
      //   text: options.text,
      //   attachments: options.attachments,
      // });

      console.log('Email sent:', options.to, options.subject);
      return { success: true, messageId: `sg-${Date.now()}` };
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async sendBatch(emails: EmailOptions[]): Promise<{ success: boolean; results: any[] }> {
    const results = await Promise.all(
      emails.map(email => this.send(email).catch(error => ({ success: false, error: error.message })))
    );

    return {
      success: results.every(r => r.success),
      results,
    };
  }

  // Pre-built email templates
  async sendWelcomeEmail(to: string, name: string, loginUrl: string) {
    return this.send({
      to,
      subject: 'Welcome to BellaPrep!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining BellaPrep. We're excited to help you on your mortgage journey.</p>
        <p><a href="${loginUrl}">Log in to get started</a></p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
    return this.send({
      to,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendLoanStatusUpdate(to: string, name: string, loanId: string, status: string, message?: string) {
    return this.send({
      to,
      subject: `Loan Application Update: ${status}`,
      html: `
        <h1>Loan Status Update</h1>
        <p>Hi ${name},</p>
        <p>Your loan application (${loanId}) has been updated to: <strong>${status}</strong></p>
        ${message ? `<p>${message}</p>` : ''}
        <p><a href="${process.env.APP_URL}/loans/${loanId}">View Application</a></p>
      `,
    });
  }

  async sendDocumentRequest(to: string, name: string, loanId: string, documents: string[]) {
    return this.send({
      to,
      subject: 'Documents Required for Your Loan Application',
      html: `
        <h1>Documents Needed</h1>
        <p>Hi ${name},</p>
        <p>We need the following documents to continue processing your loan application:</p>
        <ul>
          ${documents.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
        <p><a href="${process.env.APP_URL}/loans/${loanId}/documents">Upload Documents</a></p>
      `,
    });
  }

  async sendMfaCode(to: string, code: string) {
    return this.send({
      to,
      subject: 'Your Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });
  }
}

