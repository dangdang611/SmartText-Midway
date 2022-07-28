import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user';
import { DeleteResult, Repository } from 'typeorm';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class UserService {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(User)
  userModel: Repository<User>;

  //插入数据
  insertUser(user): Promise<User> {
    return this.userModel.save(user);
  }

  //查询数据
  getUser(userCount: string): Promise<User> {
    return this.userModel.findOneBy({ userCount });
  }

  //删除数据
  delUser(userCount: string): Promise<DeleteResult> {
    return this.userModel.delete(userCount);
  }
}
