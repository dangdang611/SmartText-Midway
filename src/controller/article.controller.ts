import { Inject, Controller, Post, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { FindOptionsSelect } from 'typeorm';
import { getArticleDTO, getLikeDTO } from '../api/dto/CommonDTO';
import { GetArticleDetailVO } from '../api/vo/CommonVO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { Article } from '../entity/article';
import { ArticleService } from '../service/article.service';
import { CommentService } from '../service/comment.service';
import { UserAttentionService } from '../service/userAttention.service';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['article'])
@Controller('/api/article')
export class ArticleController extends BaseController<Article> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  articleService: ArticleService;

  @Inject()
  userAttentionService: UserAttentionService;

  @Inject()
  commentService: CommentService;

  getService(): BaseService<Article> {
    return this.articleService;
  }

  @ApiResponse({ type: Article })
  @Post('/insert_article')
  async insertArticle(@Body() article: Article): Promise<Article> {
    article.id = new SnowflakeIdGenerate().generate().toString();
    return super.create(article);
  }

  @ApiResponse({ type: Article })
  @Get('/get_attentionArticle')
  async getAttentionArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    console.log(info);
    let attentions = await this.userAttentionService.getAttentionUsers(info);

    // 关注的所有用户
    let authorIds = [];
    attentions.forEach(async val => {
      authorIds.push({ authorId: val });
    });

    // 使用where or查询文章
    let result = await super.findAll({ id: 'ASC' }, info.page, info.size, authorIds);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_likeArticle')
  async getLikeArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    console.log(info);
    // 查询为原创的文章
    let result = await super.findAll({ id: 'ASC' }, info.page, info.size, { tag: '原创' });
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_hotArticle')
  async getHotrticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询热门文章（点赞量）
    let result = await super.findAll({ likeNum: 'DESC' }, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_newArticle')
  async getNewrticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询新文章
    let result = await super.findAll({ createTime: 'DESC' }, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_otherArticle')
  async getOtherticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询其他文章
    let result = await super.findAll({}, info.page, info.size);
    return result;
  }

  @ApiResponse({ type: GetArticleDetailVO })
  @Get('/get_articleDetail')
  async getArticleDetail(@Query('articleId') articleId: string): Promise<GetArticleDetailVO> {
    // 查询文章
    let vo = new GetArticleDetailVO();
    vo.article = await super.findById({ id: articleId });
    vo.commentNum = await this.commentService.count({ articleId: articleId });
    return vo;
  }

  @ApiResponse({ type: Article })
  @Get('/get_hotRank')
  async getHotRank(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询热门文章（浏览量）
    let select = ['id', 'title'] as FindOptionsSelect<Article>;
    let result = await super.findAll({ showNum: 'DESC' }, info.page, info.size, {}, select);
    return result;
  }

  @ApiResponse({ type: getLikeDTO })
  @Get('/giveLike_article')
  async giveLikeComment(@Query() info: getLikeDTO) {
    let atricle = await super.findById({ id: info.id });
    if (info.isAdd == '1') {
      atricle.likeNum += 1;
    } else {
      atricle.likeNum -= 1;
    }
    return super.create(atricle);
  }
}
