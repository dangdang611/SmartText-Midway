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
  @ApiProperty({ description: '用户账号' })
  userCount: string;
  @ApiProperty({ description: '用户昵称' })
  userName: string;
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

export class GetArticleInfoVO {
  @ApiProperty({ description: '已发布文章' })
  publish: Article[];
  @ApiProperty({ description: '已发布文章数量' })
  publishNum: number;
  @ApiProperty({ description: '审核中文章' })
  checking: Article[];
  @ApiProperty({ description: '审核中文章数量' })
  checkingNum: number;
  @ApiProperty({ description: '未通过审核文章' })
  fail: Article[];
  @ApiProperty({ description: '未通过审核文章数量' })
  failNum: number;
}

export class CountVO {
  @ApiProperty({ description: '获赞数量' })
  likeNum: number;

  @ApiProperty({ description: '粉丝数量' })
  fansNum: number;

  @ApiProperty({ description: '关注数量' })
  attentionNum: number;

  @ApiProperty({ description: '创作数量' })
  writeNum: number;

  @ApiProperty({ description: '展示量' })
  showNum: number;
}

export class SerachVO {
  @ApiProperty({ description: '标题' })
  title: string;

  @ApiProperty({ description: '文章id' })
  id: string;
}

export class CountWeekVO {
  @ApiProperty({ description: '近一个星期获赞数量' })
  likeAddNums: number[];

  @ApiProperty({ description: '获赞总数量' })
  likeNums: number;

  @ApiProperty({ description: '近一个星期粉丝数量' })
  fansAddNums: number[];

  @ApiProperty({ description: '粉丝数量' })
  fansNums: number;

  @ApiProperty({ description: '近一个星期展示量' })
  showAddNums: number[];

  @ApiProperty({ description: '总展示量' })
  showNums: number;
}

export class CommentVO {
  id: string;
  createTime: Date;
  articleId: string;
  userId: string;
  content: string;
  likeNum: number;
  userName: string;
  avatarUrl: string;
  targetId: string;
  targetName: string;
  articleName: string;
}
