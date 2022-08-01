import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
//定义一个实体类
@Entity('article')
export class Article extends BaseEntity {
  // 定义一个主键，每个实体类必须要主键
  // 添加数据列，属性类型会自动推断
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  content: string;

  @Column()
  coverPic: string;

  @Column()
  digest: string;

  @Column()
  specialColumn: string;

  @Column()
  tag: number;
}
