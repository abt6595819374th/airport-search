import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for the frontend origin
  app.enableCors({
    origin: 'http://localhost:5173',
    // credentials: true, // Only if you plan to send cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
