import { requestContructor } from './constructor'

export async function getListOptProcessed(params) {
  const rawList = await getListOpt()
  return rawList.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })
}

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
export function getDetail(projectId) {
  return requestContructor({
    url: '/business/project/getProjectById',
    method: 'get',
    params: {
      projectId
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/project/updateProject',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/project/addProject',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/project/deleteProjectByBatch',
    method: 'delete',
    params: {
      projectIds: ids
    },
    gbLoading: true
  })
}

// 导出excel
export function exportExcel(params) {
  return requestContructor({
    url: '/business/project/export_project',
    method: 'download',
    params
  })
}
