import { Body, Config, Controller, Inject, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { RedisService } from '@midwayjs/redis';
import { LoginDTO, LogoutDTO, RegisterDTO } from '../api/dto/CommonDTO';
import { SnowflakeIdGenerate } from '../utils/Snowflake';
import { JwtService } from '@midwayjs/jwt';
import { Assert } from '../common/Assert';
import { ErrorCode } from '../common/ErrorCode';
import { UserContext } from '../common/UserContext';
import { Constant } from '../common/Constant';
import { ILogger } from '@midwayjs/core';
import { decrypt, encrypt } from '../utils/PasswordEncoder';
import { Validate } from '@midwayjs/validate';
import { ApiResponse, ApiTags } from '@midwayjs/swagger';
import { LoginVO, LogoutVO, RegisterVO } from '../api/vo/CommonVO';
import { User } from '../entity/user';

// @ApiTags()通常用于Controller，将其分类标记
@ApiTags(['common'])
@Controller('/api')
export class CommonController {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cacheUtil: RedisService;

  @Inject()
  jwtUtil: JwtService;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @Config('jwt')
  jwtConfig;

  // @ApiResponse()用于标注API的返回值；
  @ApiResponse({ type: LoginVO })
  @Validate()
  @Post('/login', { description: '登陆' })
  async login(@Body() body: LoginDTO): Promise<LoginVO> {
    const user = await this.userService.findByUserCount(body.userCount);
    console.log(body);
    Assert.notNull(user, ErrorCode.UN_ERROR, '账号或者密码错误');

    const flag = decrypt(body.userPassword, user.userPassword);
    Assert.isTrue(flag, ErrorCode.UN_ERROR, '账号或者密码错误');

    const uc: UserContext = new UserContext(user.id, user.userCount, user.userPassword);

    // 使用用户信息作为payload来生成token
    const at = await this.jwtUtil.sign({ ...uc });
    // 生成键值key:前缀+userId+token
    const key = Constant.TOKEN + ':' + user.id + ':' + at;
    //过期时间
    const expiresIn = this.jwtConfig.expiresIn;

    // 将token存入redis中
    this.cacheUtil.set(key, JSON.stringify(uc), 'EX', expiresIn);

    const vo = new LoginVO();
    vo.accessToken = at;
    vo.expiresIn = expiresIn;
    vo.userCount = user.userCount;
    vo.userName = user.userName;
    vo.userId = user.id;
    vo.userAvatar = user.avatarUrl;
    return vo;
  }

  // @ApiResponse()用于标注API的返回值；
  @ApiResponse({ type: RegisterVO })
  @Validate()
  @Post('/register', { description: '注册' })
  async register(@Body() body: RegisterDTO): Promise<RegisterVO> {
    const user = await this.userService.findByUserCount(body.phone);
    Assert.isNull(user, ErrorCode.UN_ERROR, '用户已存在');

    // 密码加密
    const password = encrypt(body.password);
    const u = Object.assign(new User(), {
      id: new SnowflakeIdGenerate().generate().toString(),
      userCount: body.phone,
      userPassword: password,
      avatarUrl: '1.png',
      userName: body.phone,
    });

    const vo = new RegisterVO();
    vo.user = await this.userService.insert(u);
    return vo;
  }

  // @ApiResponse()用于标注API的返回值；
  @ApiResponse({ type: LogoutVO })
  @Validate()
  @Post('/logout', { description: '注销' })
  async logout(@Body() body: LogoutDTO): Promise<LogoutVO> {
    const key = 'token:' + body.userId;
    const vo = new LogoutVO();
    if (this.cacheUtil.del(key)) {
      vo.message = '注销成功';
    } else {
      vo.message = '注销失败';
    }

    return vo;
  }
}
