import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { randomUUID } from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // keep logs minimal
        base: undefined,

        // request id
        genReqId(req, res) {
          const existing =
            (req.headers['x-request-id'] as string) || (req as any).id;
          const id = existing ?? randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },

        customProps(req) {
          return { requestId: (req as any).id };
        },

        // concise req/res serialization
        serializers: {
          req(req) {
            return { id: (req as any).id, method: req.method, url: req.url };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },

        // redact secrets
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
          ],
          remove: true,
        },

        // avoid duplicate error lines; keep 4xx as warn
        customLogLevel(req, res, err) {
          if (err || res.statusCode >= 500) return 'silent';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        // ignore noisy endpoints, guard against undefined url
        autoLogging: {
          ignore: (req) => {
            const url = (req as any).originalUrl ?? req.url ?? '';
            return url === '/health' || url.startsWith('/favicon');
          },
        },

        // pretty in dev, JSON in prod
        transport: !isProd
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'HH:MM:ss.l',
                // Build the line from the log record fields (no TS issues):
                // available placeholders include {req.method} {req.url} {res.statusCode} {responseTime} etc.
                messageFormat:
                  '[rid={requestId}] {req.method} {req.url} {res.statusCode} {responseTime}ms',
                ignore: 'pid,hostname,context,req.id',
              },
            }
          : undefined,
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
