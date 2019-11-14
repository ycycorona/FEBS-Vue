import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOpt(params) {
  return requestContructor({
    url: '/business/project/getProjectList',
    method: 'get'
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/project/getProjectListByPage',
    method: 'get',
    params,
    fullData: true
  })
}
// 获取详情
export function getDetail(cityId) {
  return requestContructor({
    url: '/business/city/getCityById',
    method: 'get',
    params: {
      cityId
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/city/updateCity',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/city/addCity',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/city/deleteCityByBatch',
    method: 'delete',
    params: {
      cityIds: ids
    },
    gbLoading: true
  })
}
