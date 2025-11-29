import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  points: number;
  duration: number; // milliseconds
}

export const RateLimit = (options: RateLimitOptions) => SetMetadata('rateLimit', options);

