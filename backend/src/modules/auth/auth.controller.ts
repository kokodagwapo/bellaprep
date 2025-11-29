import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mfaService: MfaService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refresh(@Req() req: any) {
    return this.authService.refresh(req.user.userId, req.user.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Post('password/reset-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('email/verify/:token')
  @ApiOperation({ summary: 'Verify email address' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // MFA Endpoints
  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable MFA for user' })
  async enableMFA(@Req() req: any, @Body() body: { method: string }) {
    return this.mfaService.enableMFA(req.user.id, body.method as any);
  }

  @Post('mfa/verify/totp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify TOTP code' })
  async verifyTOTP(@Req() req: any, @Body() body: { code: string }) {
    const isValid = await this.mfaService.verifyTOTP(req.user.id, body.code);
    return { isValid };
  }

  @Post('mfa/verify/otp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify OTP code (SMS/Email)' })
  async verifyOTP(@Req() req: any, @Body() body: { code: string }) {
    const isValid = await this.mfaService.verifyOTP(req.user.id, body.code);
    return { isValid };
  }

  @Post('mfa/send/sms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send SMS OTP' })
  async sendSMSOTP(@Req() req: any) {
    return this.mfaService.sendSMSOTP(req.user.id);
  }

  @Post('mfa/send/email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send Email OTP' })
  async sendEmailOTP(@Req() req: any) {
    return this.mfaService.sendEmailOTP(req.user.id);
  }
}

