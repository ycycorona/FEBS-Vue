import request from 'utils/request'
import { message, /* Modal, */ notification } from 'ant-design-vue'
import stroe from '@/store'
/**
 * config{}
 * @param {object} config
 */
export function requestContructor(config) {
  let loadingFlag
  // 上方加载提示
  if (config.loading) {
    loadingFlag = message.loading('加载中', 0)
  }
  // 全局加载提示
  if (config.gbLoading) {
    stroe.commit('globalState/setGbSpinning', true)
  }

  return new Promise((resolve, reject) => {
    request[config.method](config.url, config.params)
      .then((r) => {
        if (r.data.state === 1) {
          if (config.fullData) {
            resolve(r.data)
          } else {
            resolve(r.data.data)
          }
        } else {
          reject(r.data.message)
          notification.warn({
            message: '请求错误',
            description: r.data.message || '返回数据错误',
            duration: 4
          })
        }
      })
      .finally(() => {
        loadingFlag && loadingFlag()
        config.gbLoading && stroe.commit('globalState/setGbSpinning', false)
      })
  })
}
