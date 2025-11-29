import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Sse,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
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
    return this.auditService.create(
      createAuditLogDto,
      req.user.tenantId,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  async findAll(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('borrowerId') borrowerId?: string,
    @Query('module') module?: string,
    @Query('event') event?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.auditService.findAll(
      req.user.tenantId,
      userId,
      borrowerId,
      module,
      event,
      limit ? Number(limit) : 100,
      offset ? Number(offset) : 0,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit statistics' })
  async getStats(@Request() req, @Query('days') days?: number) {
    return this.auditService.getStats(
      req.user.role === 'SUPER_ADMIN' ? undefined : req.user.tenantId,
      days ? Number(days) : 30,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  async findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Stream audit logs (SSE)' })
  streamAuditLogs(@Request() req): Observable<MessageEvent> {
    return new Observable((observer) => {
      // In production, this would use Redis pub/sub or similar
      // For now, return empty stream
      const interval = setInterval(() => {
        observer.next({ data: { type: 'ping', timestamp: new Date().toISOString() } } as MessageEvent);
      }, 30000); // Ping every 30 seconds

      return () => clearInterval(interval);
    });
  }
}

