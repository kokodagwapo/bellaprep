import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';
export const Audit = (event: string, module: string) =>
  SetMetadata(AUDIT_KEY, { event, module });

