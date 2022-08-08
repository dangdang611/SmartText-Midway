import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { commentDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { CommentService } from '../service/comment.service';
import { Comment } from '../entity/comment';
import { SnowflakeIdGenerate } from '../utils/Snowflake';

@ApiBearerAuth()
@ApiTags(['comment'])
@Controller('/comment')
export class CommentController extends BaseController<Comment> {
  @Inject()
  ctx: Context;

  @Inject()
  commentService: CommentService;

  getService(): BaseService<Comment> {
    return this.commentService;
  }
  @ApiResponse({ type: Comment })
  @Post('/add_comment')
  async addComment(@Body() info: commentDTO): Promise<Comment> {
    let comment = Object.assign(new Comment(), info);
    comment.id = new SnowflakeIdGenerate().generate().toString();
    comment.likeNum = 0;
    return super.create(comment);
  }

  @Get('/giveLike_comment')
  async giveLikeComment(@Query('commentId') id: string) {
    let comment = await super.findById({ id });
    comment.likeNum += 1;
    return super.create(comment);
  }
}
