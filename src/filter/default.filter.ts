import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ErrorCode } from '../common/ErrorCode';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    return {
      code: ErrorCode.UN_ERROR,
      msg: err.message,
    };
  }
}
