import Mock from 'mockjs2'
import UriJs from 'urijs'
import qs from 'qs'
Mock.mock(/\/control-strategy\/list/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())

  const template = {
    total: 15,
    rows: [
      {
        id: 1,
        strategyName: '一营日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 2,
        strategyName: '一营临时策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 3,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 4,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 5,
        strategyName: '会议室开会',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 6,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 7,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 8,
        strategyName: '会议室开会',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 9,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      },
      {
        id: 10,
        strategyName: '日常策略',
        createdBy: '管理员',
        createTime: '2019-07-03 15:31',
        editTime: '2019-07-03 15:31',
        receivedUserNum: 500,
        receivedDeviceNum: 700
      }
    ]
  }
  if (query.pageNum === '2') {
    template.rows.splice(5, 5)
  }

  return template
})

Mock.mock(/\/control-strategy-send-history\/list/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())
  function getItem(id) {
    return {
      id,
      strategyName: '日常策略' + id,
      createdBy: '管理员',
      sendUser: '下发人' + id,
      sendTime: '2019-07-03 15:31',
      receivedUserNum: 562,
      receivedDeviceNum: '895'
    }
  }

  let res
  if (query.pageNum === '2') {
    res = {
      rows: [],
      total: 15
    }
    for (let i = 0; i < 5; i++) {
      res.rows.push(getItem(i))
    }
  } else if (query.pageNum === '1') {
    res = {
      rows: [],
      total: 15
    }
    for (let i = 0; i < 10; i++) {
      res.rows.push(getItem(i))
    }
  }
  return res
})
