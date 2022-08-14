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

export class getArticleDTO {
  @ApiProperty({ example: '6798547768709120', description: '用户Id' })
  userId: string;
  @ApiProperty({ example: 1, description: '当前页' })
  page: number;
  @ApiProperty({ example: 3, description: '条数' })
  size: number;
}

export class getCommentDTO {
  @ApiProperty({ example: '6798547768709120', description: '文章/用户Id' })
  id: string;
  @ApiProperty({ example: 1, description: '当前页' })
  page: number;
  @ApiProperty({ example: 3, description: '条数' })
  size: number;
}

export class commentDTO {
  @ApiProperty({ example: '18613932106', description: '评论的用户Id' })
  userId: string;
  @ApiProperty({ example: '12', description: '评论的文章Id' })
  articleId: string;
  @ApiProperty({ example: '哈哈哈哈哈哈', description: '评论的内容' })
  content: string;
}

export class getLikeDTO {
  @ApiProperty({ example: '18613932106', description: 'id' })
  id: string;
  @ApiProperty({ example: 1, description: '加/减' })
  isAdd: string;
}
