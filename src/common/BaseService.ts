import { Repository } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;

  // 插入操作
  async insert(obj: T) {
    return this.getModel().save(obj);
  }

  //根据Id查询数据
  async findById(id): Promise<T> {
    return this.getModel().findOneBy({ id });
  }

  // 根据其他字段查询数据
  async findByOther(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.getModel().find({ where });
  }

  //根据关键字进行删除操作
  async del(where: FindOptionsWhere<T>) {
    return this.getModel().delete(where);
  }
}
