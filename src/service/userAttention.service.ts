import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { getArticleDTO } from '../api/dto/CommonDTO';
import { BaseService } from '../common/BaseService';
import { UserAttention } from '../entity/userAttention';
import { WeeksDate } from '../utils/WeeksDate';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class UserAttentionService extends BaseService<UserAttention> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(UserAttention)
  userAttentionModel: Repository<UserAttention>;

  getModel(): Repository<UserAttention> {
    return this.userAttentionModel;
  }

  async getAttentionUsers(info: getArticleDTO): Promise<string[]> {
    const result = await super.findAll({ id: 'ASC' }, info.page, info.size, { userId: info.userId });
    const attentions = [];

    result.forEach(val => {
      attentions.push(val.attention_userId);
    });

    return attentions;
  }

  //获取七天的记录
  async getWeekData(userId: string) {
    //获取七天的数据
    const result = await this.userAttentionModel.query(
      `
        SELECT
          DATE_FORMAT( createTime, '%Y-%m-%d' ) days,
          count(*) count 
        FROM
          
        ( SELECT * FROM userattention
        WHERE DATE_SUB( CURDATE( ), INTERVAL 7 DAY ) <= date( createTime) and attention_userId= ${userId}) as l
        
        GROUP BY
          days;`
    );

    const data = [];
    for (let i = 0; i < 8; i++) {
      const dateKey = new WeeksDate().getPreDays(i).toString().slice(0, 10);
      result.forEach(val => {
        if (val.days === dateKey) {
          data[7 - i] = Number(val.count);
        }
      });
      if (!data[7 - i]) data[7 - i] = 0;
    }
    return data;
  }
}
