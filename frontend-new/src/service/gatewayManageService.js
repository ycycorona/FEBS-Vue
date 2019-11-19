import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOptByPid(projectId) {
  return requestContructor({
    url: '/business/version/getGatewayByPid',
    method: 'get',
    params: {
      projectId
    },
    gbLoading: true
  })
}
