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
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Create a new user' })
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.userService.create(tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'List all users in tenant' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('role') role?: string,
  ) {
    return this.userService.findAll(tenantId, +page, +limit, role);
  }

  @Get('loan-officers')
  @ApiOperation({ summary: 'Get list of loan officers' })
  getLoanOfficers(@CurrentUser('tenantId') tenantId: string) {
    return this.userService.getLoanOfficers(tenantId);
  }

  @Get('processors')
  @ApiOperation({ summary: 'Get list of processors' })
  getProcessors(@CurrentUser('tenantId') tenantId: string) {
    return this.userService.getProcessors(tenantId);
  }

  @Get('underwriters')
  @ApiOperation({ summary: 'Get list of underwriters' })
  getUnderwriters(@CurrentUser('tenantId') tenantId: string) {
    return this.userService.getUnderwriters(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.userService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.userService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete user' })
  delete(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.userService.delete(id, tenantId);
  }
}

