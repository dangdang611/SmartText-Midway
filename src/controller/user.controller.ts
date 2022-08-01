import { Inject, Controller, Post, Get, Body, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { User } from '../entity/user';
import { IResult } from '../interface';
import { UserService } from '../service/user.service';

@Controller('/user')
export class UserController extends BaseController<User> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  userService: UserService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @Post('/insert_user')
  async insertUser(@Body() user: User): Promise<IResult> {
    return super.create(user);
  }

  @Get('/get_user')
  async getUser(@Query('userCount') userCount: string): Promise<IResult> {
    return super.findByOther({ userCount });
  }

  @Get('/del_user')
  async delUser(@Query('userCount') userCount: string): Promise<IResult> {
    return super.del({ userCount });
  }
}
