import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework, Application } from '@midwayjs/koa';
import { User } from '../../src/entity/user';

describe('test/controller/user.test.ts', () => {
  let app: Application;
  let o: User;

  // `beforeAll`、`afterAll` 分别会在测试开始前、后执行；
  // `createApp<Framework>()` BeforeAll阶段的error会忽略，需要手动处理异常；
  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
    } catch (error) {
      throw error;
    }
  });

  afterAll(async () => {
    await close(app);
  });

  // insert User
  it('should POST /user/insert_user', async () => {
    o = new User();
    Object.assign(o, {
      userCount: '13378950954',
      userPassword: 'lidan0611',
      avatarUrl: '2.png',
    });

    const result = await createHttpRequest(app).post('/user/insert_user').send(o);

    expect(result.status).toBe(200);
    // expect(result.text).toBe('Success!')
  });

  // findByUserCount
  it('should Get /user/get_user', async () => {
    const result = await createHttpRequest(app).get('/user/get_user?userCount=' + o.userCount);
    expect(result.status).toBe(200);
  });

  // delete User
  it('should Get /user/del_user', async () => {
    const result = await createHttpRequest(app).get('/user/del_user?userCount=' + o.userCount);
    expect(result.status).toBe(200);
  });
});
