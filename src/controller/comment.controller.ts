import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { commentDTO, getCommentDTO, getLikeDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommentService } from '../service/comment.service';
import { Comment } from '../entity/comment';
import { SnowflakeIdGenerate } from '../utils/Snowflake';
import { UserService } from '../service/user.service';
import { CommentVO } from '../api/vo/CommonVO';
import { ArticleService } from '../service/article.service';

@ApiBearerAuth()
@ApiTags(['comment'])
@Controller('/api/comment')
export class CommentController extends BaseController<Comment> {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  @Inject()
  userService: UserService;

  @Inject()
  articleService: ArticleService;

  getService(): BaseService<Comment> {
    return this.commentService;
  }

  @ApiResponse({ type: Comment })
  @Post('/add_comment')
  async addComment(@Body() info: commentDTO): Promise<Comment> {
    console.log(info);
    const comment = Object.assign(new Comment(), info);
    comment.id = new SnowflakeIdGenerate().generate().toString();
    comment.likeNum = 0;

    //更新文章表中的数据
    const article = await this.articleService.findById({ id: info.articleId });
    article.commentNum += 1;
    this.articleService.insert(article);

    return super.create(comment);
  }

  @ApiResponse({ type: getLikeDTO })
  @Get('/giveLike_comment')
  async giveLikeComment(@Query() info: getLikeDTO) {
    const comment = await super.findById({ id: info.id });
    if (info.isAdd === '1') {
      comment.likeNum += 1;
    } else {
      comment.likeNum -= 1;
    }
    return super.create(comment);
  }

  @Get('/get_comment')
  async getComment(@Query() info: getCommentDTO): Promise<[CommentVO[], number]> {
    console.log(info);
    const commentsList = await super.findAllAndCount({ createTime: 'DESC' }, info.page * info.size, info.size, {
      articleId: info.id,
    });
    const newResult: CommentVO[] = [];

    for (let i = 0; i < commentsList[0].length; i++) {
      const el = commentsList[0][i];

      const user1 = await this.userService.findById({ id: el.userId });

      let user2;
      if (el.targetId) {
        user2 = await this.userService.findById({ id: el.targetId });
      }

      const article = await this.articleService.findById({ id: el.articleId });

      let vo = new CommentVO();
      vo = Object.assign(el, new CommentVO());
      vo.userName = user1.userName;
      vo.avatarUrl = user1.avatarUrl;
      vo.targetName = user2 ? user2.userName : null;
      vo.articleName = article.title;

      newResult.push(vo);
    }
    return [newResult, commentsList[1]];
  }

  @Get('/get_myComment')
  async getMyComment(@Query() info: getCommentDTO): Promise<[CommentVO[], number]> {
    const commentsList = await super.findAllAndCount({ createTime: 'DESC' }, info.page * info.size, info.size, {
      userId: info.id,
    });
    const newResult: CommentVO[] = [];

    for (let i = 0; i < commentsList[0].length; i++) {
      const el = commentsList[0][i];

      const user1 = await this.userService.findById({ id: el.userId });

      let user2;
      if (el.targetId) {
        user2 = await this.userService.findById({ id: el.targetId });
      }

      const article = await this.articleService.findById({ id: el.articleId });

      let vo = new CommentVO();
      vo = Object.assign(el, new CommentVO());
      vo.userName = user1.userName;
      vo.avatarUrl = user1.avatarUrl;
      vo.targetName = user2 ? user2.userName : null;
      vo.articleName = article.title;

      newResult.push(vo);
    }
    return [newResult, commentsList[1]];
  }

  @Get('/get_myArticleComment')
  async getMyArticleComment(@Query() info: getCommentDTO): Promise<[CommentVO[], number]> {
    //获取本人写的文章列表
    let articleList = await this.articleService.findAll({}, 0, 0, { authorId: info.id });

    let newResult: CommentVO[] = [];
    let commentsList = [];
    for (let j = 0; j < articleList.length; j++) {
      //根据文章id来获取所有的评论
      commentsList = await super.findAllAndCount({ createTime: 'DESC' }, info.page * info.size, info.size, {
        articleId: articleList[j].id,
      });

      //根据评论的信息来补充用户的信息，，得到一条完整的数据
      for (let i = 0; i < commentsList[0].length; i++) {
        let el = commentsList[0][i];

        let res = await this.userService.findById({ id: el.userId });

        let res2;
        if (el.targetId) {
          res2 = await this.userService.findById({ id: el.targetId });
        }

        let res3;
        res3 = await this.articleService.findById({ id: el.articleId });

        let vo = new CommentVO();
        vo = Object.assign(el, new CommentVO());
        vo.userName = res.userName;
        vo.avatarUrl = res.avatarUrl;
        vo.targetName = res2 ? res2.userName : null;
        vo.articleName = res3.title;

        newResult.push(vo);
      }
    }
    return [newResult, commentsList[1]];
  }

  @Get('/get_commentNum')
  async getCommentNum(@Query('articleId') id: string): Promise<number> {
    return await super.count({ articleId: id });
  }

  @Get('/del_comment')
  async delComment(@Query('commentId') id: string): Promise<boolean> {
    return await super.del({ id });
  }
}
