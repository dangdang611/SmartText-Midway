/**
 * 添加用户访问上下文类
 *
 * 登录后存储访问上下文的状态数据，同时也会存在redis缓存中
 */
export class UserContext {
  userId: string;
  userCount: string;
  userPassword: string;
  constructor(userId: string, userCount: string, userPassword: string) {
    this.userId = userId;
    this.userCount = userCount;
    this.userPassword = userPassword;
  }
}
