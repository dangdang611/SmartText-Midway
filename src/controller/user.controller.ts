import { Inject, Controller, Get, Query, Body, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { User } from '../entity/user';
import { IResult } from '../interface';
import { UserService } from '../service/user.service';

@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  userService: UserService;

  @Post('/insert_user')
  async insertUser(@Body() user: User): Promise<IResult> {
    const result = await this.userService.insertUser(user);
    return { success: true, message: 'OK', data: result };
  }

  @Get('/get_user')
  async getUser(@Query('userCount') userCount): Promise<IResult> {
    const user = await this.userService.getUser(userCount);
    return { success: true, message: 'OK', data: user };
  }

  @Get('/del_user')
  async delUser(@Query('userCount') userCount): Promise<IResult> {
    const user = await this.userService.delUser(userCount);
    return { success: true, message: 'OK', data: user };
  }
}
