// src/app.module.ts (正确的内容)

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module'; // <-- 从正确的位置导入 ChatModule

@Module({
  imports: [
    // 把 ConfigModule 放在最前面，并设置为全局
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule, // 导入我们的聊天功能模块
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
