import { Controller, Post, Body, Get } from '@nestjs/common'; // <-- 引入 Get
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('api/chat') // <-- 我把 /api 和 /chat 合并了，更符合 RESTful 风格
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  // 新增的 GET 路由，用于获取历史记录
  @Get('history')
  async getHistory() {
    return this.chatService.getHistory();
  }
  // POST 路由保持不变
  @Post() // <-- 因为前缀已在 @Controller 中定义，这里可以留空
  async createCompletion(@Body() createChatDto: CreateChatDto) {
    const replyText = await this.chatService.generateReply(createChatDto);
    return { reply: replyText };
  }
}
