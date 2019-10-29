import Mock from 'mockjs2'
import UriJs from 'urijs'
import qs from 'qs'
Mock.mock(/\/light-control-center\/light-manage\/list/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())

  const template = {
    total: 15,
    rows: [
      {
        id: 1,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 2,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 3,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 4,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 5,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 6,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 7,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 8,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 9,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 10,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      }
    ]
  }
  if (query.pageNum === '2') {
    template.rows.splice(5, 5)
  }

  return template
})

Mock.mock(/\/light-control-center\/light-control\/list/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())

  const template = {
    total: 15,
    rows: [
      {
        id: 1,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 2,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 3,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 4,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 5,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 6,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 7,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 8,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 9,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      },
      {
        id: 10,
        projectName: '研发办公室',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        updateTime: '2019-07-03 15:31',
        gatewayName: '研发测试',
        groupName: '研发测试',
        lightId: '2001',
        approveStatus: 0
      }
    ]
  }
  if (query.pageNum === '2') {
    template.rows.splice(5, 5)
  }

  return template
})
