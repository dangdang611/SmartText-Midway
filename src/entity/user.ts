import { ApiProperty } from '@midwayjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
//定义一个实体类
@Entity('user')
export class User extends BaseEntity {
  // 定义一个主键，每个实体类必须要主键
  // 添加数据列，属性类型会自动推断
  @Column({ length: 100 })
  @ApiProperty({ example: '1.png', description: '用户头像' })
  avatarUrl: string;

  @Column()
  @ApiProperty({ example: '18613932106', description: '用户账号，即手机号' })
  userCount: string;

  @Column()
  @ApiProperty({ example: 'lidan0611', description: '用户密码' })
  userPassword: string;
}
