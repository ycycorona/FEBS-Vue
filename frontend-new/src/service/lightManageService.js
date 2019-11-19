import { requestContructor } from './constructor'
// 获取列表通过编组Id 不分页
export function getListOptByGroupId(groupId) {
  return requestContructor({
    url: '/business/version/getLightByGroupid',
    method: 'get',
    params: {
      groupId
    },
    gbLoading: true
  })
}

