/**
 * 安全验证
 */

import { httpError } from '@midwayjs/core';
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { Context, NextFunction } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { Constant } from '../common/Constant';
import { UserContext } from '../common/UserContext';

@Middleware()
export class SecurityMiddleware {
  @Inject()
  jwtUtil: JwtService;

  @Inject()
  cacheUtil: RedisService;

  // 应用拦截配置
  @Config('app.security')
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('缺少凭证');
      }

      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');

      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('无效的凭证');
      }
      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError('缺少Bearer');
      }

      // 验证token，过期会抛出异常
      const jwt = await this.jwtUtil.verify(token, { complete: true });

      // 获取jwt中存储的user信息
      const payload = jwt['payload'];

      // 还原出用户的key
      const key = Constant.TOKEN + ':' + payload.userId + ':' + token;

      // 从redis中获取到存储的user信息
      const ucStr = await this.cacheUtil.get(key);

      const uc: UserContext = JSON.parse(ucStr);

      if (payload.userCount !== uc.userCount) {
        throw new httpError.UnauthorizedError('无效的凭证');
      }

      // 存储到访问上下文中
      ctx.userContext = uc;
      return next();
    };
  }

  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;

    const exist = ignore.find(item => {
      return item.match(path);
    });

    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return 'SECURITY';
  }
}
