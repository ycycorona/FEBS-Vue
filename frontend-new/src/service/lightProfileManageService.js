import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOpt(params) {
  return requestContructor({
    url: '/business/light-onoff-profile/getLightOnoffProfileList',
    method: 'get'
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/light-onoff-profile/getOnoffProfileListByPage',
    method: 'get',
    params,
    fullData: true
  })
}
// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/light-onoff-profile/getLightOnoffProfileById',
    method: 'get',
    params: {
      profileId: id
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/light-onoff-profile/updateLightOnoffProfile',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/light-onoff-profile/addLightOnoffProfile',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/light-onoff-profile/deleteLightOnoffProfileByBatch',
    method: 'delete',
    params: {
      profileIds: ids
    },
    gbLoading: true
  })
}

// 导出excel
export function exportExcel(params) {
  return requestContructor({
    url: '/business/light-onoff-profile/export_onoffProfile',
    method: 'download',
    params
  })
}
