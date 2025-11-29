import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Sse,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditService, CreateAuditLogDto } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log' })
  async create(@Body() createAuditLogDto: CreateAuditLogDto, @Request() req) {
    return this.auditService.create({
      ...createAuditLogDto,
      tenantId: req.user.tenantId,
      userId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  async findAll(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('borrowerId') borrowerId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (userId) {
      return this.auditService.findByUser(userId, {
        skip: offset ? Number(offset) : 0,
        take: limit ? Number(limit) : 50,
      });
    }
    if (borrowerId) {
      return this.auditService.findByBorrower(borrowerId, {
        skip: offset ? Number(offset) : 0,
        take: limit ? Number(limit) : 50,
      });
    }
    return this.auditService.findByTenant(req.user.tenantId, {
      skip: offset ? Number(offset) : 0,
      take: limit ? Number(limit) : 50,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit statistics' })
  async getStats(@Request() req) {
    return this.auditService.getStats(req.user.tenantId);
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Stream audit logs (SSE)' })
  streamAuditLogs(): Observable<MessageEvent> {
    return new Observable((observer) => {
      const interval = setInterval(() => {
        observer.next({ data: { type: 'ping', timestamp: new Date().toISOString() } } as MessageEvent);
      }, 30000);

      return () => clearInterval(interval);
    });
  }
}
