/**
 * 使用bcrypt对密码进行加解密
 */

const bcrypt = require('bcryptjs');

/**
 * 加密。加上前缀{bcrypt}，为了兼容多种加密算法，这里暂时只实现bcrypt算法
 */
export function encrypt(password) {
  // 生成随机字符串
  // genSalt方法接收一个数值作为参数
  // 数值越大 生成的随机字符串复杂度越高
  // 数值越小 生成的随机字符串复杂度越低
  // 默认值是 10
  // 返回生成的随机字符串
  const salt = bcrypt.genSaltSync(5);
  // 对密码进行加密
  // 1. 要进行加密的明文
  // 2. 随机字符串
  // 返回值是加密后的密码
  const hash = bcrypt.hashSync(password, salt, 64);
  return '{bcrypt}' + hash;
}

/**
 * 解密
 */
export function decrypt(password, hash) {
  if (hash.indexOf('{bcrypt}') === 0) {
    hash = hash.slice(8);
  }
  console.log(password, hash);
  return bcrypt.compareSync(password, hash);
}
