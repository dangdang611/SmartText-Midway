import { Inject, Controller, Post, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { FindOptionsSelect } from 'typeorm';
import { getArticleDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { Article } from '../entity/article';
import { ArticleService } from '../service/article.service';
import { UserAttentionService } from '../service/userAttention.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['article'])
@Controller('/article')
export class ArticleController extends BaseController<Article> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  articleService: ArticleService;

  @Inject()
  userAttentionService: UserAttentionService;

  getService(): BaseService<Article> {
    return this.articleService;
  }

  @ApiResponse({ type: Article })
  @Post('/insert_article')
  async insertArticle(@Body() article: Article): Promise<Article> {
    article.id = new SnowflakeIdGenerate().generate().toString();
    return super.create(article);
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_attentionArticle')
  async getAttentionArticle(@Query() info: getArticleDTO) {
    console.log(info);
    let attentions = await this.userAttentionService.getAttentionUsers(info);

    // 关注的所有用户
    let authorIds = [];
    attentions.forEach(async val => {
      authorIds.push({ authorId: val });
    });

    console.log(authorIds);

    // 使用where or查询文章
    let result = await super.findAll({ id: 'ASC' }, info.page, info.size, authorIds);
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_likeArticle')
  async getLikeArticle(@Query() info: getArticleDTO) {
    console.log(info);
    // 查询为原创的文章
    let result = await super.findAll({ id: 'ASC' }, info.page, info.size, { tag: '原创' });
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_hotArticle')
  async getHotrticle(@Query() info: getArticleDTO) {
    // 查询热门文章（点赞量）
    let result = await super.findAll({ likeNum: 'DESC' }, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_newArticle')
  async getNewrticle(@Query() info: getArticleDTO) {
    // 查询新文章
    let result = await super.findAll({ createTime: 'DESC' }, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_otherArticle')
  async getOtherticle(@Query() info: getArticleDTO) {
    // 查询其他文章
    let result = await super.findAll({}, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_articleDetail')
  async getArticleDetail(@Query('articleId') articleId: string) {
    // 查询文章
    let result = await super.findById({ id: articleId });
    return result;
  }

  @ApiResponse({ type: getArticleDTO })
  @Get('/get_hotRank')
  async getHotRank(@Query() info: getArticleDTO) {
    // 查询热门文章（浏览量）
    let select = ['id', 'title'] as FindOptionsSelect<Article>;
    let result = await super.findAll({ showNum: 'DESC' }, info.page, info.size, {}, select);
    return result;
  }
}
