import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './exceptions/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription(
      'Comprehensive API documentation for the Job Recruitment Platform',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      'Auth',
      'Authentication & Authorization (Login, Register, Refresh Token)',
    )
    .addTag(
      'Candidates',
      'Candidate Profile Management (CV, Skills, Education)',
    )
    .addTag('Companies', 'Company Profile & Recruitment Management')
    .addTag('Jobs', 'Job Posting, Searching & Filtering')
    .addTag('Applications', 'Job Application Process & Status Tracking')
    .addTag('Payment', 'VNPay Integration & Package Subscription')
    .addTag(
      'Master Data',
      'General Data (Skills, Industries, Benefits, Packages)',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
