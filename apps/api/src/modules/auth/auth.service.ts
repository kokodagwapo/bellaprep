import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';
import { AuditAction, AuditResource } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mfaService: MfaService,
    private sessionService: SessionService,
  ) {}

  async validateUser(email: string, password: string, tenantSlug?: string): Promise<any> {
    let tenantId: string | null = null;
    
    if (tenantSlug) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug },
      });
      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant');
      }
      if (!tenant.isActive) {
        throw new UnauthorizedException('Tenant is inactive');
      }
      tenantId = tenant.id;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        tenantId,
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      await this.logFailedLogin(email, tenantId);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.logFailedLogin(email, tenantId, user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, mfaSecret, ...result } = user;
    return result;
  }

  async login(user: any, deviceInfo?: string, ipAddress?: string): Promise<AuthTokens | { requiresMfa: boolean; challengeId: string; methods: string[] }> {
    // Check if MFA is required
    if (user.mfaEnabled && user.mfaMethods.length > 0) {
      const challenge = await this.mfaService.createChallenge(user.id, user.mfaMethods[0]);
      return {
        requiresMfa: true,
        challengeId: challenge.id,
        methods: user.mfaMethods,
      };
    }

    return this.generateTokens(user, deviceInfo, ipAddress);
  }

  async verifyMfaAndLogin(
    challengeId: string,
    code: string,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthTokens> {
    const challenge = await this.mfaService.verifyChallenge(challengeId, code);
    
    const user = await this.prisma.user.findUnique({
      where: { id: challenge.userId },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Log MFA success
    await this.createAuditLog(
      user.tenantId!,
      user.id,
      AuditAction.MFA_VERIFIED,
      AuditResource.AUTH,
      user.id,
      { method: challenge.method },
      ipAddress,
    );

    return this.generateTokens(user, deviceInfo, ipAddress);
  }

  async generateTokens(user: any, deviceInfo?: string, ipAddress?: string): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id, deviceInfo, ipAddress);

    // Create session
    await this.sessionService.createSession(user.id, deviceInfo, ipAddress);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log successful login
    await this.createAuditLog(
      user.tenantId!,
      user.id,
      AuditAction.LOGIN,
      AuditResource.AUTH,
      user.id,
      { deviceInfo },
      ipAddress,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { tenant: true } } },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    return this.generateTokens(
      tokenRecord.user,
      tokenRecord.deviceInfo ?? undefined,
      tokenRecord.ipAddress ?? undefined,
    );
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    // Delete refresh token if provided
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Delete all sessions for this user
    await this.sessionService.deleteUserSessions(userId);

    // Log logout
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.tenantId) {
      await this.createAuditLog(
        user.tenantId,
        userId,
        AuditAction.LOGOUT,
        AuditResource.AUTH,
        userId,
      );
    }
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantSlug: string;
    phone?: string;
  }): Promise<any> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: data.tenantSlug },
    });

    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }

    // Check if email exists in tenant
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        tenantId: tenant.id,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        tenantId: tenant.id,
        role: 'BORROWER',
      },
    });

    // Log user creation
    await this.createAuditLog(
      tenant.id,
      user.id,
      AuditAction.USER_CREATED,
      AuditResource.USER,
      user.id,
      { email: data.email, role: 'BORROWER' },
    );

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all refresh tokens
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // Log password change
    if (user.tenantId) {
      await this.createAuditLog(
        user.tenantId,
        userId,
        AuditAction.PASSWORD_CHANGED,
        AuditResource.AUTH,
        userId,
      );
    }
  }

  async requestPasswordReset(email: string, tenantSlug?: string): Promise<void> {
    let tenantId: string | null = null;
    
    if (tenantSlug) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug },
      });
      if (tenant) {
        tenantId = tenant.id;
      }
    }

    const user = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    this.logger.log(`Password reset requested for ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRecord = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord.usedAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findFirst({
      where: { email: resetRecord.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    // Log password reset
    if (user.tenantId) {
      await this.createAuditLog(
        user.tenantId,
        user.id,
        AuditAction.PASSWORD_RESET,
        AuditResource.AUTH,
        user.id,
      );
    }
  }

  private async createRefreshToken(
    userId: string,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    return token;
  }

  private generateSecureToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  private async logFailedLogin(
    email: string,
    tenantId: string | null,
    userId?: string,
  ): Promise<void> {
    if (tenantId) {
      await this.createAuditLog(
        tenantId,
        userId || null,
        AuditAction.LOGIN_FAILED,
        AuditResource.AUTH,
        undefined,
        { email },
      );
    }
  }

  private async createAuditLog(
    tenantId: string,
    userId: string | null,
    action: AuditAction,
    resource: AuditResource,
    resourceId?: string,
    details?: any,
    ipAddress?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
      },
    });
  }
}

