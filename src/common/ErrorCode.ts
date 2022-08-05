// 统一接口状态、异常码
export class ErrorCode {
  //200 正常
  static OK = 200;

  // 400000-500000 平台异常
  static SYS_ERROR = 400;

  // 500000 未知异常
  static UN_ERROR = 500;

  // 600000-699999 基本业务异常
  static BIZ_ERROR = 600;
}
