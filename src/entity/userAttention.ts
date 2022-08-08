import { ApiProperty } from '@midwayjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@Entity('userAttention')
export class UserAttention extends BaseEntity {
  @ApiProperty({ example: '12', description: '用户Id' })
  @Column()
  userId: string;

  @ApiProperty({ example: '12', description: '被关注用户Id' })
  @Column()
  attention_userId: string;
}
