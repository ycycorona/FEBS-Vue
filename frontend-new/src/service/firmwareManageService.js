import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOpt(params) {
  return requestContructor({
    url: '/business/version/getVersionListByType',
    method: 'get'
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/version/getVersionListByPage',
    method: 'get',
    params,
    fullData: true
  })
}
// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/version/getVersionById',
    method: 'get',
    params: {
      versionId: id
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/version/updateVersion',
    method: 'upload',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/version/upVersionFile',
    method: 'upload',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/version/deleteVersionByBatch',
    method: 'delete',
    params: {
      versionIds: ids
    },
    gbLoading: true
  })
}

// 导出excel
// export function exportExcel(params) {
//   return requestContructor({
//     url: '/business/light-type/export_lightType',
//     method: 'download',
//     params
//   })
// }
// 网关升级
export function gatewayUpdate(params) {
  return requestContructor({
    url: '/business/version/upgradeGateways',
    method: 'get',
    params,
    gbLoading: true
  })
}
// 智能灯升级
export function lightUpdate(params) {
  return requestContructor({
    url: '/business/version/upgradeLights',
    method: 'get',
    params,
    gbLoading: true
  })
}
