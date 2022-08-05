// 使用中间件统一接口返回数据格式
import { Context, IMiddleware, NextFunction } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { ErrorCode } from '../common/ErrorCode';

// 对接口返回的数据进行统一包装
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return { code: ErrorCode.OK, msg: 'success', data: result };
    };
  }
  match(ctx) {
    return ctx.path.indexOf('/api') === 0;
  }

  static getName(): string {
    return 'API_RESPONSE_FORMAT';
  }
}
