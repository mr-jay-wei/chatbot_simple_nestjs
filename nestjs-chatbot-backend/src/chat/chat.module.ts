import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [], // ChatModule 自己不需要导入任何其他模块
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
