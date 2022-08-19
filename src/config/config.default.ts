import { MidwayConfig } from '@midwayjs/core';
import { Article } from '../entity/article';
import { User } from '../entity/user';
import { Comment } from '../entity/comment';
import { UserAttention } from '../entity/userAttention';
import { CheckingArticle } from '../entity/checkingArticle';
import { FailArticle } from '../entity/failArticle';
import { Likes } from '../entity/likes';

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
        synchronize: false,
        logging: false,

        // 配置实体模型
        entities: [User, Article, Comment, UserAttention, CheckingArticle, FailArticle, Likes],
      },
    },
  },

  // 添加jwt 配置
  jwt: {
    secret: 'setscrew',
    expiresIn: 60 * 60 * 24,
  },

  // 添加redis 配置
  redis: {
    client: {
      host: '39.99.80.36',
      password: '@ab!735(pkdu&',
      port: 6379,
      db: 0,
    },
  },

  // 添加安全拦截配置
  app: {
    security: {
      prefix: '/api', // 表示以/api开头的接口地址需要被拦截
      ignore: [
        '/api/login',
        '/api/register',
        '/api/logout',
        '/api/article/get_hotArticle',
        '/api/article/get_newArticle',
        '/api/article/get_otherArticle',
        '/api/article/get_articleDetail',
        '/api/article/get_hotRank',
        '/api/article/get_autoComplete',
        '/api/article/get_search',
        '/api/user/get_user',
      ], // 此数组中的接口地址排除在外，不会被拦截
    },
  },

  // 添加swagger配置
  swagger: {
    // 配置swagger能够支持bearer验证
    auth: { authType: 'bearer' },
  },

  // CORS配置
  cors: {
    credentials: false,
  },
} as MidwayConfig;
