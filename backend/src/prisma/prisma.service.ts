import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    
    // Multi-tenant middleware - automatically inject tenantId in WHERE clauses
    this.$use(async (params, next) => {
      // Get tenant from context (will be set by TenantMiddleware)
      const tenantId = (global as any).currentTenantId;
      
      if (tenantId && this.shouldApplyTenantFilter(params.model)) {
        // Add tenantId to where clause
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.args.where = { ...params.args.where, tenantId };
        } else if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.tenantId === undefined) {
              params.args.where = { ...params.args.where, tenantId };
            }
          } else {
            params.args.where = { tenantId };
          }
        } else if (params.action === 'create' || params.action === 'update' || params.action === 'upsert') {
          if (params.action === 'create' && params.args.data) {
            params.args.data = { ...params.args.data, tenantId };
          }
          if (params.args.where && params.args.where.tenantId === undefined) {
            params.args.where = { ...params.args.where, tenantId };
          }
        }
      }
      
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Determine if tenant filter should be applied to this model
   */
  private shouldApplyTenantFilter(model?: string): boolean {
    if (!model) return false;
    
    // Models that DON'T have tenantId (global tables)
    const globalModels = ['Tenant', 'User']; // User spans multiple tenants via TenantUser
    
    return !globalModels.includes(model);
  }

  /**
   * Clean database (for testing)
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key !== '_engineConfig' && key !== '_dmmf' && typeof key === 'string'
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return model.deleteMany();
        }
      })
    );
  }
}

