import { Inject, Controller, Put, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommonException } from '../common/CommonException';
import { FailArticle } from '../entity/failArticle';
import { FailArticleService } from '../service/failArticle.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['article'])
@Controller('/api/fail')
export class FailArticleController extends BaseController<FailArticle> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  failArticleService: FailArticleService;

  getService(): BaseService<FailArticle> {
    return this.failArticleService;
  }

  @ApiResponse({ type: FailArticle })
  @Put('/fail_article')
  async insertArticle(@Body() article): Promise<FailArticle> {
    article.id = new SnowflakeIdGenerate().generate().toString();
    if (article.tag instanceof Array) {
      article.tag = article.tag.join(',');
    }
    article.likeNum = 0;
    article.showNum = 0;
    article.commentNum = 0;
    return super.create(article);
  }

  @ApiResponse({ type: FailArticle })
  @Get('/get_articleDetail')
  async getArticleDetail(@Query('id') id: string): Promise<FailArticle> {
    // 查询文章
    return await super.findById({ id });
  }

  @ApiResponse({ type: String })
  @Get('/del_articel')
  async delArticle(@Query('articleId') articleId: string) {
    let result = await super.del({ id: articleId });
    if (!result) throw new CommonException(500, '删除失败');
    return '删除成功';
  }
}
