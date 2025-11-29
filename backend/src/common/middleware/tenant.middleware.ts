import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    name: string;
    subdomain: string;
  };
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    let tenantId: string | null = null;

    // 1. Check for tenant in header (highest priority)
    const headerTenantId = req.headers['x-tenant-id'] as string;
    if (headerTenantId) {
      tenantId = headerTenantId;
    }

    // 2. Check subdomain (e.g., acme.bellaprep.com)
    if (!tenantId) {
      const host = req.headers.host || '';
      const subdomain = this.extractSubdomain(host);
      
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        const tenant = await this.prisma.tenant.findUnique({
          where: { subdomain },
        });
        
        if (tenant) {
          tenantId = tenant.id;
          req.tenant = {
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
          };
        }
      }
    }

    // 3. Check custom domain
    if (!tenantId) {
      const host = req.headers.host || '';
      const domain = host.split(':')[0]; // Remove port
      
      const tenant = await this.prisma.tenant.findUnique({
        where: { domain },
      });
      
      if (tenant) {
        tenantId = tenant.id;
        req.tenant = {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
        };
      }
    }

    // 4. Check JWT token for tenantId
    // This will be set by JwtStrategy after authentication
    
    // Store tenantId in global context for Prisma middleware
    if (tenantId) {
      (global as any).currentTenantId = tenantId;
    }

    next();
  }

  private extractSubdomain(host: string): string | null {
    const parts = host.split('.');
    
    // For localhost or IP addresses
    if (parts.length < 3 || host.includes('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(host)) {
      return null;
    }

    // Return first part as subdomain
    return parts[0];
  }
}

