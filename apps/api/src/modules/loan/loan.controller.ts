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
import { LoanService, CreateLoanDto, UpdateLoanDto } from './loan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LoanStatus } from '@prisma/client';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan application' })
  create(
    @Body() dto: CreateLoanDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.create(tenantId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all loans' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: LoanStatus,
    @Query('productId') productId?: string,
    @Query('borrowerId') borrowerId?: string,
    @Query('loanOfficerId') loanOfficerId?: string,
  ) {
    return this.loanService.findAll(tenantId, +page, +limit, {
      status,
      productId,
      borrowerId,
      loanOfficerId,
    });
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Get loan statistics' })
  getStats(@CurrentUser('tenantId') tenantId: string) {
    return this.loanService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.loanService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update loan' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLoanDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.update(id, tenantId, dto, userId);
  }

  @Patch(':id/form-data')
  @ApiOperation({ summary: 'Update loan form data' })
  updateFormData(
    @Param('id') id: string,
    @Body() formData: any,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.updateFormData(id, tenantId, formData, userId);
  }

  @Post(':id/assign/:type')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'LOAN_OFFICER')
  @ApiOperation({ summary: 'Assign staff to loan' })
  assign(
    @Param('id') id: string,
    @Param('type') type: 'loanOfficer' | 'processor' | 'underwriter' | 'closer',
    @Body('assigneeId') assigneeId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.assign(id, tenantId, type, assigneeId, userId);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to loan' })
  addNote(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('isPrivate') isPrivate: boolean,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.addNote(id, tenantId, content, userId, isPrivate);
  }

  @Post(':id/conditions')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'PROCESSOR', 'UNDERWRITER')
  @ApiOperation({ summary: 'Add condition to loan' })
  addCondition(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('category') category: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.loanService.addCondition(id, tenantId, title, description, category);
  }

  @Post('conditions/:conditionId/clear')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'PROCESSOR', 'UNDERWRITER')
  @ApiOperation({ summary: 'Clear a loan condition' })
  clearCondition(
    @Param('conditionId') conditionId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.loanService.clearCondition(conditionId, tenantId, userId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN')
  @ApiOperation({ summary: 'Delete loan' })
  delete(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.loanService.delete(id, tenantId);
  }
}

