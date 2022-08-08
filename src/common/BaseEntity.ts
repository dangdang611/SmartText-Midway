//大多数的情况下，所有的实体类都有统一的字段，需要抽取实体模型的基类

import { CreateDateColumn, PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createTime: Date;
}
