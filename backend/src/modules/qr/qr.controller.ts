import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QRService } from './qr.service';
import { CreateQRDto } from './dto/create-qr.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('qr')
@Controller('qr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QRController {
  constructor(private readonly qrService: QRService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new QR code' })
  async create(@Body() createQRDto: CreateQRDto, @Request() req) {
    return this.qrService.create(createQRDto, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all QR codes for tenant' })
  async findAll(@Request() req) {
    return this.qrService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get QR code by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.qrService.findOne(id, req.user.tenantId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate QR code token (public endpoint)' })
  async validateToken(@Body() body: { token: string }) {
    return this.qrService.validateToken(body.token);
  }

  @Post('scan')
  @ApiOperation({ summary: 'Scan QR code token' })
  async scanToken(
    @Body() body: {
      token: string;
      userId?: string;
      borrowerId?: string;
    },
    @Headers('x-forwarded-for') ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.qrService.scanToken(body.token, {
      ipAddress,
      userAgent,
      userId: body.userId,
      borrowerId: body.borrowerId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete QR code' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.qrService.remove(id, req.user.tenantId);
  }
}

