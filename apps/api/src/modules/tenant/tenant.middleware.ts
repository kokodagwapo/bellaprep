import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../common/prisma/prisma.service';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenant?: any;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain, header, or query param
    let tenantSlug = this.extractTenantSlug(req);

    if (tenantSlug) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug },
      });

      if (!tenant) {
        throw new BadRequestException('Invalid tenant');
      }

      if (!tenant.isActive) {
        throw new BadRequestException('Tenant is inactive');
      }

      req.tenantId = tenant.id;
      req.tenant = tenant;
    }

    next();
  }

  private extractTenantSlug(req: Request): string | null {
    // 1. Check header
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) return headerTenant;

    // 2. Check query param
    const queryTenant = req.query.tenant as string;
    if (queryTenant) return queryTenant;

    // 3. Check subdomain
    const host = req.headers.host || '';
    const parts = host.split('.');
    if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'api') {
      return parts[0];
    }

    return null;
  }
}

