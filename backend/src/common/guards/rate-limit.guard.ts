import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RateLimitConfig {
  points: number;
  duration: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const config = this.reflector.get<RateLimitConfig>('rateLimit', context.getHandler()) || {
      points: 100,
      duration: 60000, // 1 minute
    };

    const identifier = this.getIdentifier(request);
    const now = Date.now();
    
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.duration,
      });
      return true;
    }

    if (record.count >= config.points) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }

  private getIdentifier(request: any): string {
    // Use IP + User ID if authenticated, otherwise just IP
    const ip = request.ip || request.connection.remoteAddress;
    const userId = request.user?.id;
    return userId ? `${ip}:${userId}` : ip;
  }
}

