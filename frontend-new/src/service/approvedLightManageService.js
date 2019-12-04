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

// 单/多选设置智能灯频道(下发指令)
export function pushSetPindaoByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetPindaoByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选设置智能灯频道(下发指令)
export function pushSetPANIDByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetPANIDByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选修改经纬度(下发指令)
export function pushSetLatlngByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetLatlngByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选校表(下发指令)
export function pushSetJiaobiaoByBatch(lightIds) {
  return requestContructor({
    url: '/business/approvedLight/pushSetJiaobiaoByBatch',
    method: 'post',
    params: {
      lightIds
    },
    gbLoading: true
  })
}

// 单/多选时间校准(下发指令)
export function pushSetSysTimeByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetSysTimeByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选设置报警阈(下发指令)
export function pushSetThresholdByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetThresholdByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选设置红外触发参数(下发指令)
export function pushSetTriggerByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetTriggerByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 单/多选设置强制开关灯功率(下发指令)
export function pushSetSwitchPowerByBatch(params) {
  return requestContructor({
    url: '/business/approvedLight/pushSetSwitchPowerByBatch',
    method: 'post',
    params,
    gbLoading: true
  })
}
