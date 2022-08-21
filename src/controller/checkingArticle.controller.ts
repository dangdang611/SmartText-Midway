import { Inject, Controller, Put, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommonException } from '../common/CommonException';
import { CheckingArticle } from '../entity/checkingArticle';
import { ArticleService } from '../service/article.service';
import { CheckingArticleService } from '../service/checkingArticle.service';
import { FailArticleService } from '../service/failArticle.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['article'])
@Controller('/api/publish')
export class CheckingArticleController extends BaseController<CheckingArticle> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  checkingArticleService: CheckingArticleService;

  @Inject()
  articleService: ArticleService;

  @Inject()
  failArticleService: FailArticleService;

  getService(): BaseService<CheckingArticle> {
    return this.checkingArticleService;
  }

  @ApiResponse({ type: CheckingArticle })
  @Put('/publish_article')
  async insertArticle(@Body() article): Promise<CheckingArticle> {
    console.log(article);
    article.id = new SnowflakeIdGenerate().generate().toString();
    if (article.tag instanceof Array) {
      article.tag = article.tag.join(',');
    }
    article.likeNum = 0;
    article.showNum = 0;
    article.commentNum = 0;
    return super.create(article);
  }

  @ApiResponse({ type: CheckingArticle })
  @Get('/get_articleDetail')
  async getArticleDetail(@Query('id') id: string): Promise<CheckingArticle> {
    // 查询文章
    return await super.findById({ id });
  }

  @ApiResponse({ type: String })
  @Get('/del_articel')
  async delArticle(@Query('articleId') articleId: string): Promise<string> {
    const result = await super.del({ id: articleId });
    if (!result) throw new CommonException(500, '删除失败');
    return '删除成功';
  }

  @ApiResponse({ type: String })
  @Get('/pass_articel')
  async passArticle(@Query('articleId') articleId: string): Promise<CheckingArticle> {
    const article = await super.findById({ id: articleId });
    await super.del({ id: articleId });
    return await this.articleService.insert(article);
  }

  @ApiResponse({ type: String })
  @Get('/fail_articel')
  async failArticle(@Query('articleId') articleId: string): Promise<CheckingArticle> {
    const article = await super.findById({ id: articleId });
    await super.del({ id: articleId });
    return await this.failArticleService.insert(article);
  }
}
