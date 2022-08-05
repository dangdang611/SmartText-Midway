import { ApiProperty } from '@midwayjs/swagger';

/**
 * 添加DTO
 * DTO：一般是用来封装前端发送过来的数据的
 */
export class LoginDTO {
  @ApiProperty({ example: '18613932106', description: '用户账号，即手机号' })
  userCount: string;
  @ApiProperty({ example: 'lidan0611', description: '用户密码' })
  userPassword: string;
}

export class RegisterDTO {
  @ApiProperty({ example: '18613932106', description: '注册手机号' })
  phone: string;
  @ApiProperty({ example: 'lidan0611', description: '密码' })
  password: string;
  @ApiProperty({ example: '8520', description: '验证码' })
  code: string;
}

export class LogoutDTO {
  @ApiProperty({ example: '112', description: '用户ID' })
  userId: string;
}
