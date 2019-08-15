import Mock from 'mockjs2'

Mock.mock(/\/test\/tree-select-data/, 'get', {
  id: 'dept_1',
  label: '114师',
  nodeType: 1,
  db_id: '1',
  children: [
    {
      id: 'user_1.1',
      label: '114师师长',
      nodeType: 2,
      db_id: '1.1'
    },
    {
      id: 'dept_1-1',
      label: '1101团',
      nodeType: 1,
      db_id: '1-1',
      children: [
        {
          id: 'user_1-1.1',
          label: '1101团团长',
          nodeType: 2,
          db_id: '1-1.1'
        },
        {
          id: 'dept_1-1-1',
          label: '1101团1营',
          nodeType: 1,
          db_id: '1-1-1',
          children: [
            {
              id: 'dept_1-1-1-1',
              label: '1101团1营1连',
              nodeType: 1,
              db_id: '1-1-1-1',
              children: [
                {
                  id: 'user_1-1-1-1-1',
                  label: '战士小王',
                  nodeType: 2,
                  db_id: '1-1-1-1-1'
                },
                {
                  id: 'user_1-1-1-1-2',
                  label: '战士小李',
                  nodeType: 2,
                  db_id: '1-1-1-1-2'
                },
                {
                  id: 'user_1-1-1-1-3',
                  label: '战士小张',
                  nodeType: 2,
                  db_id: '1-1-1-1-3'
                },
                {
                  id: 'user_1-1-1-1-4',
                  label: '战士小王',
                  nodeType: 2,
                  db_id: '1-1-1-1-4'
                },
                {
                  id: 'user_1-1-1-1-5',
                  label: '战士小李',
                  nodeType: 2,
                  db_id: '1-1-1-1-5'
                },
                {
                  id: 'user_1-1-1-1-6',
                  label: '战士小张',
                  nodeType: 2,
                  db_id: '1-1-1-1-6'
                }
              ]
            },
            {
              id: 'dept_1-1-1-2',
              label: '1101团1营2连',
              nodeType: 1,
              db_id: '1-1-1-2'
            },
            {
              id: 'dept_1-1-1-3',
              label: '1101团1营3连',
              nodeType: 1,
              db_id: '1-1-1-3'
            }
          ]
        }
      ]
    },
    {
      id: '1-2',
      label: '1102团',
      children: [

      ]
    },
    {
      id: '1-3',
      label: '1103团',
      children: [

      ]
    }
  ]
})
