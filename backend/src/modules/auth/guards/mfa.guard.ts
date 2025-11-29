import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MfaGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If MFA is enabled, require MFA verification
    if (user?.mfaEnabled && !request.headers['x-mfa-verified']) {
      return false;
    }

    return true;
  }
}

