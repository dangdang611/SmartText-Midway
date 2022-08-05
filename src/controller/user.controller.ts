import { Inject, Controller, Post, Get, Body, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { User } from '../entity/user';
import { UserService } from '../service/user.service';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user')
export class UserController extends BaseController<User> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  userService: UserService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @ApiResponse({ type: User })
  @Post('/insert_user')
  async insertUser(@Body() user: User): Promise<User> {
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
}
