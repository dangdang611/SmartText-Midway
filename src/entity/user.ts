import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
//定义一个实体类
@Entity('user')
export class User extends BaseEntity {
  // 定义一个主键，每个实体类必须要主键
  // 添加数据列，属性类型会自动推断
  @Column({ length: 100 })
  avatarUrl: string;

  @Column()
  userCount: string;

  @Column()
  userPassword: string;
}
