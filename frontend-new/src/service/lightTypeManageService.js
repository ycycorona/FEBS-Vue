import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOpt(params) {
  return requestContructor({
    url: '/business/light-type/getLightTypeList',
    method: 'get'
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/light-type/getLightTypeListByPage',
    method: 'get',
    params,
    fullData: true
  })
}
// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/light-type/getLightTypeById',
    method: 'get',
    params: {
      lightTypeId: id
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/light-type/updateLightType',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/light-type/addLightType',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/light-type/deleteLightTypeByBatch',
    method: 'delete',
    params: {
      lightTypeIds: ids
    },
    gbLoading: true
  })
}

// 导出excel
export function exportExcel(params) {
  return requestContructor({
    url: '/business/light-type/export_lightType',
    method: 'download',
    params
  })
}
