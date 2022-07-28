import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
//定义一个实体类
@Entity('user')
export class User {
  // 定义一个主键，每个实体类必须要主键
  // 添加数据列，属性类型会自动推断
  @PrimaryColumn({ generated: true })
  userId: number;

  @Column({ length: 100 })
  avatarUrl: string;

  @Column()
  userCount: string;

  @Column()
  userPassword: string;

  @CreateDateColumn()
  createDate: string;
}
