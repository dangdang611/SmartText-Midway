import { Controller, Inject } from '@midwayjs/decorator';
import { ArticleService } from '../service/article.service';

@Controller('/api/article')
export class ArticleController {
  @Inject()
  articleService: ArticleService;

  // @Post('/insert_article')
  // async insertArticle(@Body() article): Promise<IResult> {
  //   const result = await this.articleService.insertArticle(article);
  //   return { success: true, message: 'OK', data: result };
  // }
}
