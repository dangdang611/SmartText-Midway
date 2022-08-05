import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as crossDomain from '@midwayjs/cross-domain';
import { FormatMiddleware } from './middleware/format.middleware';
import { DefaultErrorFilter } from './filter/default.filter';
import { SecurityMiddleware } from './middleware/security.middleware';

@Configuration({
  imports: [
    crossDomain,
    swagger,
    redis, //注册redis组件
    jwt, // 注册jwt组件
    orm, // 注册orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([SecurityMiddleware, ReportMiddleware, FormatMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
