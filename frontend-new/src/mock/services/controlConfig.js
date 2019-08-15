import Mock from 'mockjs2'
import UriJs from 'urijs'
import qs from 'qs'
Mock.mock(/\/control-config\/electric-fence/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())
  function getItem(id) {
    return {
      id,
      electricFenceName: '电子围栏' + id,
      electricFenceType: 1,
      center: '万科中心',
      radius: 50,
      electricFenceX: 120.551263,
      electricFenceY: 36.65215964,
      createdBy: '管理员',
      createTime: '2019-07-03 15:31'
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
Mock.mock(/\/control-config\/black-app-list\/list/, 'get', ({ url, type, body }) => {
  const uri = new UriJs(url)
  const query = qs.parse(uri.query())
  function getItem(id) {
    return {
      id,
      appName: 'QQ' + id,
      packageName: 'com.qq.mobileqq',
      createdBy: '管理员',
      createTime: '2019-07-03 15:31',
      marks: '杜绝使用'
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
