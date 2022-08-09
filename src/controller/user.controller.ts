import { Inject, Controller, Post, Get, Body, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { CountVO } from '../api/vo/CommonVO';
import { Assert } from '../common/Assert';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { ErrorCode } from '../common/ErrorCode';
import { User } from '../entity/user';
import { UserService } from '../service/user.service';
import { UserAttentionService } from '../service/userAttention.service';
import { encrypt } from '../utils/PasswordEncoder';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user')
export class UserController extends BaseController<User> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  userService: UserService;

  @Inject()
  attentionService: UserAttentionService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @ApiResponse({ type: User })
  @Post('/insert_user')
  async insertUser(@Body() user: User): Promise<User> {
    const u = await this.userService.findByUserCount(user.userCount);
    Assert.isNull(u, ErrorCode.UN_ERROR, '用户已存在');

    //生成ID
    user.id = new SnowflakeIdGenerate().generate().toString();
    // 密码加密
    user.userPassword = encrypt(user.userPassword);
    return super.create(user);
  }

  @ApiResponse({ type: User })
  @Get('/get_user')
  async getUser(@Query('userCount') userCount: string): Promise<User> {
    return super.findByOther({ userCount });
  }

  @ApiResponse({ type: Boolean })
  @Get('/del_user')
  async delUser(@Query('userCount') userCount: string): Promise<boolean> {
    return super.del({ userCount });
  }

  @ApiResponse({ type: CountVO })
  @Get('/count_user')
  async countUser(@Query('userId') id: string): Promise<CountVO> {
    let vo = new CountVO();
    vo.likeNum = await super.count({ id });
    vo.fansNum = await this.attentionService.count({ attention_userId: id });
    vo.attentionNum = await this.attentionService.count({ userId: id });
    return vo;
  }
}
