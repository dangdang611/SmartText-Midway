import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@Entity('comment')
export class Comment extends BaseEntity {
  @ApiProperty({ example: '12', description: '评论对应的文章Id' })
  // 表与表之间的关联依靠@OneToOne()这个装饰器来绑定
  // 传递的这个回调函数，直接指向绑定关联的实体类
  @Column()
  articleId: string;

  @ApiProperty({ example: '12', description: '评论的用户Id' })
  @Column()
  userId: string;

  @ApiProperty({ example: '123', description: '评论的内容 ' })
  @Column()
  content: string;

  @ApiProperty({ example: '123', description: '回复的对象' })
  @Column()
  targetId: string;

  @ApiProperty({ example: 12, description: '评论点赞数' })
  @Column()
  likeNum: number;
}
