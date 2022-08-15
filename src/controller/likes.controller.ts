import { Inject, Controller, Query, Get } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { LikeDTO } from '../api/dto/CommonDTO';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { Likes } from '../entity/likes';
import { LikesService } from '../service/likes.service';

@ApiBearerAuth()
@ApiTags(['like'])
@Controller('/api/like')
export class LikeController extends BaseController<Likes> {
  @Inject()
  ctx: Context;

  //`@Inject()`装饰类指定该对象会被自动注入；
  @Inject()
  likeService: LikesService;

  getService(): BaseService<Likes> {
    return this.likeService;
  }

  @ApiResponse({ type: String })
  @Get('/isLike')
  async isLike(@Query() info: LikeDTO): Promise<boolean> {
    let result = await super.findByOther({ like_userId: info.userId, articleId: info.articleId });
    console.log(result);
    if (result != null) return true;
    else return false;
  }
}
