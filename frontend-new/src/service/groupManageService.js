import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOpt(params) {
  return requestContructor({
    url: '/business/group/getGroupList',
    method: 'get'
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/group/getGroupListByPage',
    method: 'get',
    params,
    fullData: true
  })
}
// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/group/getGroupById',
    method: 'get',
    params: {
      groupId: id
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/group/updateGroup',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/group/addGroup',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/group/deleteGroupByBatch',
    method: 'delete',
    params: {
      groupIds: ids
    },
    gbLoading: true
  })
}

// 导出excel
export function exportExcel(params) {
  return requestContructor({
    url: '/business/group/export_group',
    method: 'download',
    params
  })
}

// 通过项目获取编组
export function getListOptByProjectId(id) {
  return requestContructor({
    url: '/business/version/getGroupByPorjectId',
    method: 'get',
    params: {
      projectId: id
    },
    gbLoading: true
  })
}
