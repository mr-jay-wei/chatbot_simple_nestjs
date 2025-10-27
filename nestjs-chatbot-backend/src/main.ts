import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 引入ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 启用CORS，允许前端应用访问
  app.enableCors();

  // 2. 使用全局管道来启用DTO验证
  app.useGlobalPipes(new ValidationPipe());

  // 监听5000端口，与之前的Express应用保持一致
  await app.listen(5000);
}
bootstrap();
