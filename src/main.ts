import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';

// ── Shared app initialisation ───────────────────────────────────────────────

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // ── Global Pipes ──────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,           // auto-transform payloads to DTO instances
    }),
  );

  // ── Global Filters ────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global Interceptors ───────────────────────────────────────
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );

  // ── Swagger (development only) ────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Poro Guess API')
      .setDescription('REST API for the Poro Guess game — powered by NestJS & Prisma')
      .setVersion('1.0')
      .addTag('Users', 'User management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  return app;
}

// ── Local development server ────────────────────────────────────────────────

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on: http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📖 Swagger docs:      http://localhost:${port}/api`);
  }
}

// ── AWS Lambda handler ──────────────────────────────────────────────────────
// The NestJS app is initialised once and reused across warm Lambda invocations.

let cachedHandler: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedHandler = serverlessExpress({ app: expressApp });
  }
  return cachedHandler(event, context, callback);
};

// ── Entrypoint (local only) ─────────────────────────────────────────────────
// When running via `node dist/main` or `nest start`, bootstrap the HTTP server.
// In Lambda, this block is not executed — only `handler` is invoked.

if (require.main === module) {
  bootstrap();
}
