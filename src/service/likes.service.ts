import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';
import { Likes } from '../entity/likes';
import { SnowflakeIdGenerate } from '../utils/Snowflake';
import { WeeksDate } from '../utils/WeeksDate';

// @Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用@Inject`注入就可以了
@Provide()
export class LikesService extends BaseService<Likes> {
  // @InjectEntityModel` 注入实体模型数据库操作工具
  @InjectEntityModel(Likes)
  likeModel: Repository<Likes>;

  getModel(): Repository<Likes> {
    return this.likeModel;
  }

  //保存
  async save(articleId, userId) {
    const like = new Likes();
    like.id = new SnowflakeIdGenerate().generate().toString();
    like.articleId = articleId;
    like.like_userId = userId;
    return await super.insert(like);
  }

  //删除
  async delete(articleId, userId) {
    return await super.del({ like_userId: userId, articleId: articleId });
  }

  //获取七天的记录
  async getWeekData(userId: string) {
    //获取七天的数据
    const result = await this.likeModel.query(
      `
        SELECT
          DATE_FORMAT( createTime, '%Y-%m-%d' ) days,
          count(*) count 
        FROM
          
        ( SELECT * FROM likes
        WHERE DATE_SUB( CURDATE( ), INTERVAL 7 DAY ) <= date( createTime) and like_userId= ${userId}) as l
        
        GROUP BY
          days;`
    );
    console.log(result);

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
