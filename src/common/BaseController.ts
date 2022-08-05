import { Body, Get, Post, Query } from '@midwayjs/decorator';
import { BaseEntity } from './BaseEntity';
import { BaseService } from './BaseService';

/**
 * Controller基础类，由于类继承不支持装饰类@Post、@Query、@Body等，
 * 所以这里的装饰类不生效，否则实现类就不需要再写多余代码了，
 * 这里保留在这里，以备以后可能会支持继承的装饰类
 */
export abstract class BaseController<T extends BaseEntity> {
  abstract getService(): BaseService<T>;

  @Post('/create')
  async create(@Body() obj: T): Promise<T> {
    return await this.getService().insert(obj);
  }

  @Get('/findById')
  async findById(@Query('id') id: string): Promise<T> {
    return await this.getService().findById(id);
  }

  @Get('/findByOther')
  async findByOther(@Query('key') key): Promise<T> {
    return await this.getService().findByOther(key);
  }

  @Get('/del')
  async del(@Query('key') key): Promise<boolean> {
    let result = await this.getService().del(key);
    return result.affected ? true : false;
  }

  @Post('/update')
  async update(@Body() obj: T): Promise<T> {
    return this.getService().insert(obj);
  }
}

// 没有使用中间件的写法，需要自己每次返回结果之前组织格式
// @Post('/update')
// async update(@Body() obj: T): Promise<IResult> {
//   const result = this.getService().insert(obj);
//   return { success: true, message: 'OK', data: result };
// }
