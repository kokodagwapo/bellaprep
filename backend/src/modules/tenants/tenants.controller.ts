import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new tenant (SuperAdmin only)' })
  async create(@Body() data: any) {
    return this.tenantsService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tenants (SuperAdmin only)' })
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  async findOne(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tenantsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tenant (SuperAdmin only)' })
  async delete(@Param('id') id: string) {
    return this.tenantsService.delete(id);
  }

  @Put(':id/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant settings' })
  async updateSettings(@Param('id') id: string, @Body() settings: any) {
    return this.tenantsService.updateSettings(id, settings);
  }

  @Put(':id/branding')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant branding' })
  async updateBranding(@Param('id') id: string, @Body() branding: any) {
    return this.tenantsService.updateBranding(id, branding);
  }
}

