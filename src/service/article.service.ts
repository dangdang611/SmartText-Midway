import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
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

  // 统计用户文章的总访问量
  async countShowNum(authorId: string): Promise<number> {
    let select = ['showNum'] as FindOptionsSelect<Article>;
    let data = await this.findAll({}, null, null, { authorId }, select);
    let result = 0;
    data.forEach(el => {
      result += Number(el.showNum);
    });
    return result;
  }
}
