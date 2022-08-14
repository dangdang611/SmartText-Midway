import { ApiProperty } from '@midwayjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

//定义一个实体类
@Entity('failArticle')
export class FailArticle extends BaseEntity {
  // 定义一个主键，每个实体类必须要主键
  // 添加数据列，属性类型会自动推断
  @ApiProperty({ example: '123', description: '文章标题' })
  @Column()
  title: string;

  @ApiProperty({ example: '009', description: '发布人ID' })
  @Column()
  authorId: string;

  @ApiProperty({ example: '小白', description: '发布人' })
  @Column()
  authorName: string;

  @ApiProperty({ example: '哒哒哒嗒嗒嗒', description: '文章内容：HTML格式' })
  @Column()
  content: string;

  @ApiProperty({ example: '哒哒哒嗒嗒嗒', description: '文章内容：MD格式' })
  @Column()
  mdContent: string;

  @ApiProperty({ example: '1.png', description: '封面' })
  @Column()
  coverPic: string;

  @ApiProperty({ example: '我是摘要', description: '文章摘要' })
  @Column()
  digest: string;

  @ApiProperty({ example: '123', description: '专栏' })
  @Column()
  specialColumn: string;

  @ApiProperty({ example: '原创', description: '标签' })
  @Column()
  tag: string;

  @ApiProperty({ example: 12, description: '点赞数' })
  @Column()
  likeNum: number;

  @ApiProperty({ example: 12, description: '浏览量' })
  @Column()
  showNum: number;

  @ApiProperty({ example: 12, description: '评论量' })
  @Column()
  commentNum: number;
}
