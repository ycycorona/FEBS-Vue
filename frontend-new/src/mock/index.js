import Mock from 'mockjs2'

// 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  // 使用同步加载依赖
  console.log('mock mounting')
  require('./services/test')
  require('./services/controlStrategy')
  require('./services/controlConfig')

  Mock.setup({
    timeout: 800 // setter delay time
  })
  console.log('mock mounted')
}
