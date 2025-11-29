import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(
      createUserDto,
      req.user.role,
      req.user.tenantId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Request() req) {
    return this.usersService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      req.user.role,
      req.user.tenantId,
      req.user.id,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.role, req.user.tenantId);
  }

  @Post('invite')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Invite a new user (Admin only)' })
  async invite(@Body() inviteUserDto: InviteUserDto, @Request() req) {
    return this.usersService.invite(inviteUserDto, req.user.tenantId);
  }
}

