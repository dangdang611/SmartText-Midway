module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  // 添加如下一行代码，引入jest初始化文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
