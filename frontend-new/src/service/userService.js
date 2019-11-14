import { requestContructor } from './constructor'
// 获取select opt
export function getList(params) {
  return requestContructor({
    url: '/business/city/getCityListByPage',
    method: 'get',
    fullData: true
  })
}
