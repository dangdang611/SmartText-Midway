/**
 * 添加VO
 * VO：一般就是将要返回给前端的数据封装成对象再返回
 */

import { ApiProperty } from '@midwayjs/swagger';
import { User } from '../../entity/user';

export class LoginVO {
  @ApiProperty({ description: 'Token' })
  accessToken: string;
  @ApiProperty({ description: '过期时间' })
  expiresIn: number;
}

export class RegisterVO {
  @ApiProperty({ description: '注册成功的用户信息' })
  user: User;
}

export class LogoutVO {
  @ApiProperty({ description: '注销成功信息' })
  message: '注销成功';
}
