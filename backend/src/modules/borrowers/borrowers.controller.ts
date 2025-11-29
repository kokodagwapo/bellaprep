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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { LoanStatus } from '@prisma/client';

@ApiTags('borrowers')
@Controller('borrowers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new borrower' })
  async create(@Body() createBorrowerDto: CreateBorrowerDto, @Request() req) {
    return this.borrowersService.create(createBorrowerDto, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all borrowers for tenant' })
  async findAll(@Request() req, @Query('status') status?: LoanStatus) {
    return this.borrowersService.findAll(req.user.tenantId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get borrower by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.borrowersService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update borrower' })
  async update(
    @Param('id') id: string,
    @Body() updateBorrowerDto: UpdateBorrowerDto,
    @Request() req,
  ) {
    return this.borrowersService.update(id, updateBorrowerDto, req.user.tenantId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit borrower form' })
  async submitForm(
    @Param('id') id: string,
    @Body() submitFormDto: SubmitFormDto,
    @Request() req,
  ) {
    return this.borrowersService.submitForm(id, submitFormDto, req.user.tenantId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update borrower loan status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: LoanStatus },
    @Request() req,
  ) {
    return this.borrowersService.updateStatus(id, body.status, req.user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete borrower' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.borrowersService.remove(id, req.user.tenantId);
  }
}

