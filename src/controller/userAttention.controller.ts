import { Inject, Controller, Post, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { getArticleDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { UserAttention } from '../entity/userAttention';
import { UserAttentionService } from '../service/userAttention.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['attention'])
@Controller('/attention')
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
}
