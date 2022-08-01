import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entity/article';

@Provide()
export class ArticleService {
  @InjectEntityModel(Article)
  articleModel: Repository<Article>;

  // // 插入文章
  // insertArticle(article): Promise<Article> {
  //   return this.articleModel.save(article);
  // }

  // // 获取文章详情
  // getArticleDetail(articleId: string): Promise<Article> {
  //   return this.articleModel.findOneBy({ articleId });
  // }

  // //删除文章
  // delArticle(articleId: string): Promise<DeleteResult> {
  //   return this.articleModel.delete({ articleId });
  // }
}
