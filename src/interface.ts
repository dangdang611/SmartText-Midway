import { UserContext } from './common/UserContext';

/**
 * @description User-Service parameters
 */
declare module '@midwayjs/core' {
  interface Context {
    userContext: UserContext;
  }
}
