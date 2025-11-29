import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain or header
    const subdomain = req.headers['x-tenant-subdomain'] as string;
    const tenantId = req.headers['x-tenant-id'] as string;

    // If user is authenticated, use their tenantId
    if (req.user?.tenantId) {
      req['tenantId'] = req.user.tenantId;
      return next();
    }

    // Try to resolve tenant from subdomain
    if (subdomain) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { subdomain },
      });

      if (tenant) {
        req['tenantId'] = tenant.id;
        return next();
      }
    }

    // Try tenantId header
    if (tenantId) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (tenant) {
        req['tenantId'] = tenant.id;
        return next();
      }
    }

    // For public endpoints, continue without tenant context
    // For protected endpoints, this will be handled by guards
    next();
  }
}

