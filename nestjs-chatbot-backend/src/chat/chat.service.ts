import { Injectable, InternalServerErrorException, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService implements OnModuleInit {
  private openai: OpenAI;
  private supabase: SupabaseClient;

  // 引入 NestJS 内置的 Logger，比 console.log 更专业
  private readonly logger = new Logger(ChatService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // --- OpenAI 初始化 ---
    const apiKey = this.configService.get<string>('MODEL_SCOPE_API_KEY');
    if (!apiKey) {
      // 如果没找到，就抛出错误，让应用启动失败，这是好事！
      throw new Error('MODEL_SCOPE_API_KEY is not defined in the .env file');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api-inference.modelscope.cn/v1',
    });

    // --- Supabase 初始化 (核心修改点) ---
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    // ✅ 新增的健壮性检查
    if (!supabaseUrl || !supabaseKey) {
      // 如果 URL 或 Key 有一个没找到，就抛出错误，防止应用带着错误的配置运行
      throw new Error('Supabase URL or Service Key is not defined in the .env file');
    }

    // ✅ 因为上面的检查，TypeScript 在这里就 100% 确定
    //    supabaseUrl 和 supabaseKey 都是 string 类型，不再是 undefined
    //    所以错误就消失了！
    this.supabase = createClient(supabaseUrl, supabaseKey);

    this.logger.log('ChatService has been initialized.');
  }
  
  // 新增方法：获取历史记录
  async getHistory() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('sender, text') // 我们只需要这两个字段
      .order('created_at', { ascending: true }); // 按时间升序排列

    if (error) {
      console.error('Error fetching history:', error);
      throw new InternalServerErrorException('获取历史记录时出错');
    }
    return data;
  }

  // 修改 generateReply 方法以保存消息
  async generateReply(createChatDto: CreateChatDto): Promise<string> {
    try {
      const { message } = createChatDto;

      // 1. 先从 LLM 获取回复
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'ZhipuAI/GLM-4.6',
        messages: [{ role: 'user', content: message }],
      });
      const replyContent = chatCompletion.choices[0].message.content;
      if (!replyContent) {
        throw new Error('模型返回了空内容。');
      }

      // 2. 将用户消息和机器人回复一起存入数据库
      const { error } = await this.supabase.from('messages').insert([
        { sender: 'user', text: message },
        { sender: 'bot', text: replyContent },
      ]);

      if (error) {
        // 如果数据库保存失败，我们依然返回内容，但会在后端记录错误
        // 在生产应用中，这里可能需要更复杂的错误处理
        console.error('Error saving messages to Supabase:', error);
      }
      return replyContent;
    } catch (error) {
      console.error('调用或保存消息时出错:', error);
      throw new InternalServerErrorException('调用大模型或保存消息时出错');
    }
  }
}
