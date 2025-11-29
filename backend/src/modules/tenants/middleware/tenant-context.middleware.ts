import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId?: string;
    role?: string;
  };
  tenantId?: string;
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const subdomain = req.headers['x-tenant-subdomain'] as string;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (req.user?.tenantId) {
      req.tenantId = req.user.tenantId;
      return next();
    }

    if (subdomain) {
      const tenant = await this.prisma.tenant.findFirst({
        where: { subdomain },
      });

      if (tenant) {
        req.tenantId = tenant.id;
        return next();
      }
    }

    if (tenantId) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (tenant) {
        req.tenantId = tenant.id;
        return next();
      }
    }

    next();
  }
}
