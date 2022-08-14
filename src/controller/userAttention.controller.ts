import { Inject, Controller, Post, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { getArticleDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommonException } from '../common/CommonException';
import { UserAttention } from '../entity/userAttention';
import { UserAttentionService } from '../service/userAttention.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['attention'])
@Controller('/api/attention')
export class UserAttentionController extends BaseController<UserAttention> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  userAttentionService: UserAttentionService;

  getService(): BaseService<UserAttention> {
    return this.userAttentionService;
  }

  @ApiResponse({ type: UserAttention })
  @Post('/setAttention')
  async setAttention(@Body() body: UserAttention): Promise<UserAttention> {
    body.id = new SnowflakeIdGenerate().generate().toString();
    return super.create(body);
  }

  @ApiResponse({ type: String })
  @Get('/getAttention')
  async getAttention(@Query() info: getArticleDTO): Promise<String[]> {
    return await this.userAttentionService.getAttentionUsers(info);
  }

  @ApiResponse({ type: UserAttention })
  @Post('/delAttention')
  async delAttention(@Body() body: UserAttention): Promise<string> {
    let result = await super.del({ userId: body.userId, attention_userId: body.attention_userId });
    if (!result) throw new CommonException(500, '删除失败');
    return '删除成功';
  }
}
