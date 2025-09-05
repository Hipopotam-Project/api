// src/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const reqId = req?.id ?? req?.headers?.['x-request-id'];
    const isDev = process.env.NODE_ENV !== 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse();
      // For 4xx we keep the actual message; for 5xx keep it generic
      const rawMsg = typeof r === 'string' ? r : ((r as any).message ?? r);
      if (status < 500)
        message = Array.isArray(rawMsg) ? rawMsg[0] : String(rawMsg);
    }

    // Log full details (server-side) with stack
    const logger = req?.log ?? console;
    if (exception instanceof Error) {
      logger.error({ err: exception, requestId: reqId }, 'Unhandled exception');
    } else {
      logger.error({ exception, requestId: reqId }, 'Unhandled thrown value');
    }

    // Minimal client payload (don’t leak internals)
    const payload: Record<string, any> = {
      statusCode: status,
      message,
      requestId: reqId,
    };

    // Optional: include error name in dev for faster debugging
    if (isDev && exception instanceof Error) {
      payload.error = exception.name;
    }

    httpAdapter.reply(res, payload, status);
  }
}
