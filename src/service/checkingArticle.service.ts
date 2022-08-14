import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';
import { CheckingArticle } from '../entity/checkingArticle';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class CheckingArticleService extends BaseService<CheckingArticle> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(CheckingArticle)
  checkingArticleModel: Repository<CheckingArticle>;

  getModel(): Repository<CheckingArticle> {
    return this.checkingArticleModel;
  }

  async getAll(userId, page, size): Promise<CheckingArticle[]> {
    return await super.findAll({ createTime: 'DESC' }, page * size, size, {
      authorId: userId,
    });
  }
}
