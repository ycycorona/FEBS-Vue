import { requestContructor } from './constructor'
// 获取列表 不分页
export function getListOptByPid(projectId) {
  return requestContructor({
    url: '/business/notApprovedLight/getNotApproveLightListByPage',
    method: 'get',
    params: {
      projectId
    },
    gbLoading: true
  })
}

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/approvedLight/getApproveLightListByPage',
    method: 'get',
    params,
    fullData: true,
    gbLoading: true
  })
}

// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/approvedLight/getLightDetailByLightId',
    method: 'get',
    params: {
      lightId: id
    }
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/notApprovedLight/updateNotApprovedLight',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/notApprovedLight/addLight',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/notApprovedLight/deleteNotApprovedLightByBatch',
    method: 'delete',
    params: {
      notApprovedLightIds: ids
    },
    gbLoading: true
  })
}

// 导入excel

export function importExcel(params) {
  return requestContructor({
    url: '/business/notApprovedLight/excelImport',
    method: 'upload',
    params
  })
}

// 导出excel
export function exportExcel(params) {
  return requestContructor({
    url: '/business/gateway/export_gateway',
    method: 'download',
    params
  })
}

// 获取编辑下拉框数据
export function getPopWindowData() {
  return requestContructor({
    url: '/business/notApprovedLight/getAddLightWindowData',
    method: 'post',
    params: {

    }
  })
}

// 批量审核智能灯
export function approve(ids) {
  return requestContructor({
    url: '/business/notApprovedLight/approveLightByBatch',
    method: 'post',
    params: {
      lightIds: ids
    },
    gbLoading: true
  })
}
