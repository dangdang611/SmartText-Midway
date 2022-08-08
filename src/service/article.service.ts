import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';
import { Article } from '../entity/article';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class ArticleService extends BaseService<Article> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(Article)
  articleModel: Repository<Article>;

  getModel(): Repository<Article> {
    return this.articleModel;
  }
}
