import { Inject, Controller, Put, Body, Get, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { FindOptionsSelect, Like } from 'typeorm';
import { getArticleDTO, getLikeDTO } from '../api/dto/CommonDTO';
import { GetArticleInfoVO } from '../api/vo/CommonVO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommonException } from '../common/CommonException';
import { Article } from '../entity/article';
import { ArticleService } from '../service/article.service';
import { CheckingArticleService } from '../service/checkingArticle.service';
import { CommentService } from '../service/comment.service';
import { FailArticleService } from '../service/failArticle.service';
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
  checkingArticleService: CheckingArticleService;

  @Inject()
  failArticleService: FailArticleService;

  @Inject()
  commentService: CommentService;

  getService(): BaseService<Article> {
    return this.articleService;
  }

  @ApiResponse({ type: Article })
  @Put('/insert_article')
  async insertArticle(@Body() article): Promise<Article> {
    article.id = new SnowflakeIdGenerate().generate().toString();
    if (article.tag instanceof Array) {
      article.tag = article.tag.join(',');
    }
    article.likeNum = 0;
    article.showNum = 0;
    article.commentNum = 0;
    return super.create(article);
  }

  @ApiResponse({ type: Article })
  @Get('/get_attentionArticle')
  async getAttentionArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    let attentions = await this.userAttentionService.getAttentionUsers(info);

    // 关注的所有用户
    let authorIds = [];
    attentions.forEach(async val => {
      authorIds.push({ authorId: val });
    });

    let result = [];
    if (attentions.length) {
      // 使用where or查询文章
      result = await super.findAll({ id: 'ASC' }, info.page * info.size, info.size, authorIds);
    }

    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_likeArticle')
  async getLikeArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询为原创的文章
    let result = await super.findAll({ id: 'ASC' }, info.page * info.size, info.size, { tag: '原创' });
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_hotArticle')
  async getHotArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询热门文章（点赞量）
    let result = await super.findAll({ likeNum: 'DESC' }, info.page * info.size, info.size);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_newArticle')
  async getNewArticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询新文章
    let result = await super.findAll({ createTime: 'DESC' }, info.page * info.size, info.size);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_otherArticle')
  async getOtherAticle(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询其他文章
    let result = await super.findAll({}, info.page * info.size, info.size);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/get_myArticle')
  async getMyArticle(@Query() info: getArticleDTO): Promise<GetArticleInfoVO> {
    // 查询我的文章
    let vo = new GetArticleInfoVO();
    // 已发布
    vo.publish = await super.findAll({ createTime: 'DESC' }, info.page * info.size, info.size, {
      authorId: info.userId,
    });
    vo.publishNum = await super.count({
      authorId: info.userId,
    });

    // 审核中
    vo.checking = await this.checkingArticleService.getAll(info.userId, info.page, info.size);
    vo.checkingNum = await this.checkingArticleService.count({
      authorId: info.userId,
    });

    //未通过
    vo.fail = await this.failArticleService.getAll(info.userId, info.page, info.size);
    vo.failNum = await this.failArticleService.count({
      authorId: info.userId,
    });
    return vo;
  }

  @ApiResponse({ type: Article })
  @Get('/get_articleDetail')
  async getArticleDetail(@Query('articleId') articleId: string): Promise<Article> {
    // 查询文章
    return await super.findById({ id: articleId });
  }

  @ApiResponse({ type: Article })
  @Get('/get_hotRank')
  async getHotRank(@Query() info: getArticleDTO): Promise<Article[]> {
    // 查询热门文章（浏览量）
    let select = ['id', 'title'] as FindOptionsSelect<Article>;
    let result = await super.findAll({ showNum: 'DESC' }, info.page * info.size, info.size, {}, select);
    return result;
  }

  @ApiResponse({ type: Article })
  @Get('/giveLike_article')
  async giveLikeComment(@Query() info: getLikeDTO): Promise<Article> {
    let atricle = await super.findById({ id: info.id });
    if (info.isAdd == '1') {
      atricle.likeNum += 1;
    } else {
      atricle.likeNum -= 1;
    }
    return super.create(atricle);
  }

  @ApiResponse({ type: getLikeDTO })
  @Get('/get_autoComplete')
  async getAutoComplete(@Query('keyword') key: string) {
    return await super.findAll({ id: 'ASC' }, 0, 5, { title: Like('%' + key + '%') }, [
      'title',
      'id',
    ] as FindOptionsSelect<Article>);
  }

  @ApiResponse({ type: getLikeDTO })
  @Get('/get_search')
  async getSearch(@Query('keyword') key: string) {
    return await super.findAll({ id: 'ASC' }, 0, 5, { title: Like('%' + key + '%') });
  }

  @ApiResponse({ type: String })
  @Get('/del_articel')
  async delArticle(@Query('articleId') articleId: string): Promise<string> {
    let result = await super.del({ id: articleId });
    if (!result) throw new CommonException(500, '删除失败');
    return '删除成功';
  }
}
