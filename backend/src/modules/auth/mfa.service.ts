import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MFAMethod } from '@prisma/client';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Enable MFA for user
   */
  async enableMFA(userId: string, method: MFAMethod): Promise<{ secret?: string; qrCode?: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const mfaMethods = (user.mfaMethods as any) || [];

    if (method === MFAMethod.TOTP) {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `BellaPrep (${user.email})`,
        length: 32,
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          totpSecret: secret.base32,
          mfaMethods: [...mfaMethods, method],
        },
      });

      return {
        secret: secret.base32,
        qrCode: secret.otpauth_url,
      };
    }

    // For other methods, just enable
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaMethods: [...mfaMethods, method],
      },
    });

    return {};
  }

  /**
   * Verify TOTP code
   */
  async verifyTOTP(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.totpSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });
  }

  /**
   * Generate OTP for SMS/Email
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send SMS OTP
   */
  async sendSMSOTP(userId: string): Promise<void> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP (you'd use Redis in production for better performance)
    // For now, we'll store in user's metadata
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Store in a separate OTP table in production
        mfaMethods: { otp, expiresAt } as any,
      },
    });

    // TODO: Send SMS via Twilio
  }

  /**
   * Send Email OTP
   */
  async sendEmailOTP(userId: string): Promise<void> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaMethods: { otp, expiresAt } as any,
      },
    });

    // TODO: Send email via SendGrid
  }

  /**
   * Verify OTP (SMS/Email)
   */
  async verifyOTP(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return false;
    }

    const mfaData = user.mfaMethods as any;
    if (!mfaData || !mfaData.otp || !mfaData.expiresAt) {
      return false;
    }

    if (new Date(mfaData.expiresAt) < new Date()) {
      return false;
    }

    return mfaData.otp === code;
  }

  /**
   * Store WebAuthn credential
   */
  async storeWebAuthnCredential(userId: string, credential: any): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const credentials = (user?.webauthnCredentials as any) || [];
    credentials.push(credential);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        webauthnCredentials: credentials as any,
      },
    });
  }

  /**
   * Verify WebAuthn credential
   */
  async verifyWebAuthnCredential(userId: string, credentialId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.webauthnCredentials) {
      return false;
    }

    const credentials = user.webauthnCredentials as any;
    return credentials.some((c: any) => c.id === credentialId);
  }

  /**
   * Store face embedding (encrypted)
   */
  async storeFaceEmbedding(userId: string, embedding: string): Promise<void> {
    // Encrypt embedding before storing
    const encrypted = this.encryptData(embedding);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        faceEmbedding: encrypted,
      },
    });
  }

  /**
   * Verify face embedding
   */
  async verifyFaceEmbedding(userId: string, embedding: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.faceEmbedding) {
      return false;
    }

    const storedEmbedding = this.decryptData(user.faceEmbedding);

    // Compare embeddings (cosine similarity or Euclidean distance)
    // This is a placeholder - implement proper face recognition comparison
    return this.compareFaceEmbeddings(storedEmbedding, embedding);
  }

  /**
   * Encrypt sensitive data
   */
  private encryptData(data: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   */
  private decryptData(encryptedData: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);

    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Compare face embeddings (placeholder)
   */
  private compareFaceEmbeddings(embedding1: string, embedding2: string): boolean {
    // Implement proper face recognition comparison
    // Calculate cosine similarity or Euclidean distance
    // Return true if similarity > threshold
    return embedding1 === embedding2; // Placeholder
  }
}

