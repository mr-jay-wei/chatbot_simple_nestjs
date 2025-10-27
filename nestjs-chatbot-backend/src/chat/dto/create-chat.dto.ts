// 我们需要从 class-validator 库中引入装饰器来进行验证
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString() // 验证 message 字段必须是字符串
  @IsNotEmpty() // 验证 message 字段不能为空
  message: string;
}
