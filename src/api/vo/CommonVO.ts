/**
 * 添加VO
 * VO：一般就是将要返回给前端的数据封装成对象再返回
 */

import { ApiProperty } from '@midwayjs/swagger';
import { Article } from '../../entity/article';
import { User } from '../../entity/user';

export class LoginVO {
  @ApiProperty({ description: 'Token' })
  accessToken: string;
  @ApiProperty({ description: '过期时间' })
  expiresIn: number;
  @ApiProperty({ description: '用户Id' })
  userCount: string;
  @ApiProperty({ description: '用户Id' })
  userId: string;
  @ApiProperty({ description: '用户头像' })
  userAvatar: string;
}

export class RegisterVO {
  @ApiProperty({ description: '注册成功的用户信息' })
  user: User;
}

export class LogoutVO {
  @ApiProperty({ description: '注销成功信息' })
  message: string;
}

export class GetArticleDetailVO {
  @ApiProperty({ description: '获取文章资讯信息' })
  article: Article;

  @ApiProperty({ description: '评论数' })
  commentNum: number;
}

export class CountVO {
  @ApiProperty({ description: '获赞数量' })
  likeNum: number;

  @ApiProperty({ description: '粉丝数量' })
  fansNum: number;

  @ApiProperty({ description: '关注数量' })
  attentionNum: number;
}
