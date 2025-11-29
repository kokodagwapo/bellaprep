import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new tenant (SuperAdmin only)' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all tenants (SuperAdmin only)' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.tenantService.findAll(+page, +limit);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tenant details' })
  async getCurrentTenant(@CurrentUser('tenantId') tenantId: string) {
    return this.tenantService.findOne(tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get tenant by ID (SuperAdmin only)' })
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update tenant' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() user: any,
  ) {
    // Lender admins can only update their own tenant
    if (user.role !== 'SUPER_ADMIN' && user.tenantId !== id) {
      throw new Error('Unauthorized');
    }
    return this.tenantService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete tenant (SuperAdmin only)' })
  delete(@Param('id') id: string) {
    return this.tenantService.delete(id);
  }

  @Get(':id/stats')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Get tenant statistics' })
  getStats(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'SUPER_ADMIN' && user.tenantId !== id) {
      throw new Error('Unauthorized');
    }
    return this.tenantService.getStats(id);
  }
}

