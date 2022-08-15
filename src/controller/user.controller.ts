import { Inject, Controller, Post, Get, Body, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { CountVO, CountWeekVO } from '../api/vo/CommonVO';
import { Assert } from '../common/Assert';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { ErrorCode } from '../common/ErrorCode';
import { User } from '../entity/user';
import { ArticleService } from '../service/article.service';
import { LikesService } from '../service/likes.service';
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

  @Inject()
  articleService: ArticleService;

  @Inject()
  likesService: LikesService;

  @Inject()
  userAttentionService: UserAttentionService;

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
  @Post('/update_user')
  async updatetUser(@Body() user): Promise<User> {
    const u = await this.userService.findByUserCount(user.userCount);
    let newUser = { ...u, ...user };
    return super.create(newUser);
  }

  @ApiResponse({ type: User })
  @Get('/get_user')
  async getUser(@Query('userId') userId: string): Promise<User> {
    return super.findByOther({ id: userId });
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
    vo.writeNum = await this.articleService.count({ authorId: id });
    vo.showNum = await this.articleService.countShowNum(id);
    return vo;
  }

  @ApiResponse({ type: CountVO })
  @Get('/count_week_user')
  async countWeekUser(@Query('userId') id: string): Promise<CountWeekVO> {
    let vo = new CountWeekVO();
    vo.likeAddNums = await this.likesService.getWeekData();
    vo.likeNums = await super.count({ id });
    vo.fansAddNums = await this.userAttentionService.getWeekData();
    vo.fansNums = await this.attentionService.count({ attention_userId: id });
    vo.showAddNums = [4, 0, 2, 2, 5, 3, 7];
    vo.showNums = await this.articleService.countShowNum(id);
    console.log(vo);
    return vo;
  }
}
