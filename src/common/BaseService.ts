import { FindOptionsOrder, FindOptionsSelect, Repository } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;

  // 插入操作
  async insert(obj: T) {
    console.log('要插入的数据是：');
    console.log(obj);

    let result = await this.getModel().save(obj);
    return result;
  }

  //根据Id查询数据
  async findById(id: FindOptionsWhere<T>): Promise<T> {
    console.log(id);
    return this.getModel().findOneBy(id);
  }

  // 根据其他字段查询数据
  async findByOther(where: FindOptionsWhere<T>): Promise<T> {
    return this.getModel().findOne({ where });
  }

  // 根据字段查询多条数据
  async findAll(
    order: FindOptionsOrder<T>,
    skip: number,
    take: number,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    select?: FindOptionsSelect<T>
  ): Promise<T[]> {
    return this.getModel().find({
      select,
      where,
      order,
      skip,
      take,
    });
  }

  //根据关键字进行删除操作
  async del(where: FindOptionsWhere<T>) {
    return this.getModel().delete(where);
  }
}
