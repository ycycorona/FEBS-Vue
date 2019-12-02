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

// 获取列表
export function getList(params) {
  return requestContructor({
    url: '/business/gateway/getGatewayListByPage',
    method: 'get',
    params,
    fullData: true,
    gbLoading: true
  })
}

// 获取详情
export function getDetail(id) {
  return requestContructor({
    url: '/business/gateway/getGatewayById',
    method: 'get',
    params: {
      gatewayId: id
    },
    gbLoading: true
  })
}
// 修改
export function save(params) {
  return requestContructor({
    url: '/business/gateway/updateGateway',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 新建
export function add(params) {
  return requestContructor({
    url: '/business/gateway/addGateway',
    method: 'post',
    params,
    gbLoading: true
  })
}
// 删除
export function del(ids) {
  return requestContructor({
    url: '/business/gateway/deleteGatewayByBatch',
    method: 'delete',
    params: {
      gatewayIds: ids
    },
    gbLoading: true
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

// 网关读取电表指令
export function getElectricityMeter(id) {
  return requestContructor({
    url: '/business/gateway/getdianbiao',
    method: 'get',
    params: {
      gatewayId: id
    },
    gbLoading: true
  })
}

// 下发读取网关配置的指令（得到网关频道、panid等）
export function getGatewayConfig(id) {
  return requestContructor({
    url: '/business/gateway/getGatewayConfig',
    method: 'get',
    params: {
      gatewayId: id
    },
    gbLoading: true
  })
}

// 根据网关id获取电表地址,返回的是网关对象包含网关地址
export function getMeterAddressById(id) {
  return requestContructor({
    url: '/business/gateway/getMeterAddressById',
    method: 'get',
    params: {
      gatewayId: id
    },
    gbLoading: true
  })
}

// 根据网关id获取网关的继电器
export function getRelayByGatewayId(id) {
  return requestContructor({
    url: '/business/gateway/getRelayByGatewayId',
    method: 'get',
    params: {
      gatewayId: id
    },
    gbLoading: true
  })
}

// 给网关发送修改频道指令
export function setChannel(params) {
  return requestContructor({
    url: '/business/gateway/setPindao',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 给网关发送修改panid指令
export function setPANID(params) {
  return requestContructor({
    url: '/business/gateway/setPANID',
    method: 'post',
    params,
    gbLoading: true
  })
}

// 给网关修改电表地址
export function setMeterAddress(params) {
  return requestContructor({
    url: '/business/gateway/setMeterAddress',
    method: 'post',
    params,
    gbLoading: true
  })
}
