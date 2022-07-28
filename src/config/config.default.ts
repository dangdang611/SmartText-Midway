import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1658994051208_1031',
  koa: {
    port: 7001,
  },
  // 添加orm配置
  typeorm: {
    dataSource: {
      default: {
        // 单数据库实例
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '1024',
        database: 'smarttext',
        // 首次启动没有创建表结构的，需要设置自动创建表接口
        synchronize: true,
        logging: true,

        // 配置实体模型
        entities: [User],
      },
    },
  },
} as MidwayConfig;
