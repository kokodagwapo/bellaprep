import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, user } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;
        this.logger.log(
          `${method} ${url} ${statusCode} - ${delay}ms`,
          `${method} ${url}`,
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          `${method} ${url} ${error.status || 500} - ${delay}ms - ${error.message}`,
          error.stack,
          `${method} ${url}`,
        );
        return throwError(() => error);
      }),
    );
  }
}

