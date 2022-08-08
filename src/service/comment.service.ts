import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';
import { Comment } from '../entity/comment';

@Provide()
export class CommentService extends BaseService<Comment> {
  @InjectEntityModel(Comment)
  commentModel: Repository<Comment>;

  getModel(): Repository<Comment> {
    return this.commentModel;
  }
}
