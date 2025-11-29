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
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DocumentType } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Generate presigned URL for document upload' })
  generateUploadUrl(
    @Body('loanId') loanId: string,
    @Body('fileName') fileName: string,
    @Body('mimeType') mimeType: string,
    @Body('documentType') documentType: DocumentType,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.generateUploadUrl(
      tenantId,
      loanId,
      fileName,
      mimeType,
      documentType,
    );
  }

  @Post(':id/confirm-upload')
  @ApiOperation({ summary: 'Confirm document upload completed' })
  confirmUpload(
    @Param('id') id: string,
    @Body('size') size: number,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.confirmUpload(id, tenantId, size);
  }

  @Get()
  @ApiOperation({ summary: 'List all documents' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('loanId') loanId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.documentService.findAll(tenantId, loanId, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.findOne(id, tenantId);
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'Generate download URL for document' })
  generateDownloadUrl(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.generateDownloadUrl(id, tenantId);
  }

  @Post(':id/verify')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'PROCESSOR', 'UNDERWRITER')
  @ApiOperation({ summary: 'Verify document' })
  verify(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.documentService.verify(id, tenantId, userId);
  }

  @Post(':id/reject')
  @Roles('SUPER_ADMIN', 'LENDER_ADMIN', 'PROCESSOR', 'UNDERWRITER')
  @ApiOperation({ summary: 'Reject document' })
  reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.documentService.reject(id, tenantId, userId, reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  delete(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.delete(id, tenantId);
  }

  @Patch(':id/ocr-data')
  @ApiOperation({ summary: 'Update document OCR data' })
  updateOcrData(
    @Param('id') id: string,
    @Body('ocrData') ocrData: any,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.documentService.updateOcrData(id, tenantId, ocrData);
  }
}

