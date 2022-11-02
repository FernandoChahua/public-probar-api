import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/exception/http-exception.filter';

async function bootstrap() {
  const logLevels: LogLevel[] =
    process.env.NODE_ENV === 'prod'
      ? ['error', 'log', 'warn', 'debug', 'verbose']
      : ['error', 'log', 'warn', 'debug', 'verbose'];
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: logLevels,
  });
  app.use((req, res, next) => {
    const allowedOrigins = [
      'http://127.0.0.1:8020',
      'http://localhost:8020',
      'http://127.0.0.1:9000',
      'http://localhost:9000',
    ];
    const { origin } = req.headers;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    return next();
  });

  const config = new DocumentBuilder()
    .setTitle('ProbAR Api')
    .setDescription('Api del proyecto de probador de zapatillas.')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .addServer('v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*', // 'http://localhost:3000'
    credentials: true,
  });

  await app.listen(AppModule.port);
}
bootstrap();
