import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as otplib from 'otplib';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MfaService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Configure TOTP
    otplib.authenticator.options = {
      window: 1, // Allow 1 step before/after for time sync issues
    };
  }

  async enableTotp(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = otplib.authenticator.generateSecret();
    const appName = 'BellaPrep';
    const accountName = user.email;

    const qrCodeUrl = otplib.authenticator.keyuri(accountName, appName, secret);

    // Store secret temporarily (not yet verified)
    await this.prisma.mfaChallenge.create({
      data: {
        userId,
        method: 'TOTP_SETUP',
        code: secret, // Store secret for verification
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    return { secret, qrCodeUrl };
  }

  async verifyTotpSetup(userId: string, code: string): Promise<void> {
    const challenge = await this.prisma.mfaChallenge.findFirst({
      where: {
        userId,
        method: 'TOTP_SETUP',
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      throw new BadRequestException('No pending TOTP setup found');
    }

    const isValid = otplib.authenticator.check(code, challenge.code!);
    if (!isValid) {
      throw new BadRequestException('Invalid TOTP code');
    }

    // Save the secret and enable MFA
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: true,
          mfaSecret: challenge.code, // TODO: Encrypt this
          mfaMethods: { push: 'TOTP' },
        },
      }),
      this.prisma.mfaChallenge.update({
        where: { id: challenge.id },
        data: { verified: true },
      }),
    ]);
  }

  async createChallenge(userId: string, method: string): Promise<{ id: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    let code: string | null = null;

    switch (method) {
      case 'SMS':
      case 'EMAIL':
        code = this.generateOtp();
        // TODO: Send code via SMS or email
        break;
      case 'TOTP':
        // No code to store, user provides from authenticator app
        break;
      default:
        throw new BadRequestException('Invalid MFA method');
    }

    const challenge = await this.prisma.mfaChallenge.create({
      data: {
        userId,
        method,
        code: code ? await this.hashCode(code) : null,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    return { id: challenge.id };
  }

  async verifyChallenge(challengeId: string, code: string): Promise<{ userId: string; method: string }> {
    const challenge = await this.prisma.mfaChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new UnauthorizedException('Invalid challenge');
    }

    if (challenge.expiresAt < new Date()) {
      throw new UnauthorizedException('Challenge expired');
    }

    if (challenge.verified) {
      throw new UnauthorizedException('Challenge already used');
    }

    if (challenge.attempts >= 3) {
      throw new UnauthorizedException('Too many attempts');
    }

    let isValid = false;

    switch (challenge.method) {
      case 'SMS':
      case 'EMAIL':
        isValid = await this.verifyHashedCode(code, challenge.code!);
        break;
      case 'TOTP':
        const user = await this.prisma.user.findUnique({
          where: { id: challenge.userId },
        });
        if (user?.mfaSecret) {
          isValid = otplib.authenticator.check(code, user.mfaSecret);
        }
        break;
    }

    if (!isValid) {
      await this.prisma.mfaChallenge.update({
        where: { id: challengeId },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid code');
    }

    await this.prisma.mfaChallenge.update({
      where: { id: challengeId },
      data: { verified: true },
    });

    return { userId: challenge.userId, method: challenge.method };
  }

  async disableMfa(userId: string, password: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify password before disabling
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaMethods: [],
      },
    });
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async hashCode(code: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return bcrypt.hash(code, 10);
  }

  private async verifyHashedCode(code: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(code, hash);
  }
}

