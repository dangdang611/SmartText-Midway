import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@Entity('likes')
export class Likes extends BaseEntity {
  @ApiProperty({ example: '12', description: '文章Id' })
  @Column()
  articleId: string;

  @ApiProperty({ example: '12', description: '点赞的用户' })
  @Column()
  like_userId: string;
}
