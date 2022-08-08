import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { getArticleDTO } from '../api/dto/CommonDTO';
import { BaseService } from '../common/BaseService';
import { UserAttention } from '../entity/userAttention';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class UserAttentionService extends BaseService<UserAttention> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(UserAttention)
  userAttentionModel: Repository<UserAttention>;

  getModel(): Repository<UserAttention> {
    return this.userAttentionModel;
  }

  async getAttentionUsers(info: getArticleDTO): Promise<String[]> {
    let result = await super.findAll({ id: 'ASC' }, info.page, info.size, { userId: info.userId });
    let attentions = [];

    result.forEach(val => {
      attentions.push(val.attention_userId);
    });

    return attentions;
  }
}
