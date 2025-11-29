import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IntegrationType } from '@prisma/client';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all integrations for tenant' })
  async findAll(@Request() req) {
    return this.integrationsService.findAll(req.user.tenantId);
  }

  @Post(':type')
  @ApiOperation({ summary: 'Create or update integration' })
  async upsert(
    @Request() req,
    @Param('type') type: IntegrationType,
    @Body() config: any,
  ) {
    return this.integrationsService.upsert(req.user.tenantId, type, config);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disconnect integration' })
  async disconnect(@Param('id') id: string) {
    await this.integrationsService.disconnect(id);
    return { success: true };
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  async testConnection(@Param('id') id: string) {
    const success = await this.integrationsService.testConnection(id);
    return { success };
  }
}
