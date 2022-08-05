import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class UserService extends BaseService<User> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(User)
  userModel: Repository<User>;

  getModel(): Repository<User> {
    return this.userModel;
  }

  // 通过用户账号查找用户
  async findByUserCount(userCount: string): Promise<User> {
    return super.findByOther({ userCount });
  }
}
