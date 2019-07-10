import Mock from 'mockjs2'

Mock.mock(/\/test\/tree-select-data/, 'get', {
  id: '1',
  label: '114师',
  children: [
    {
      id: '1-1',
      label: '1101团',
      children: [
        {
          id: '1-1-1',
          label: '1101团1营',
          children: [
            {
              id: '1-1-1-1',
              label: '1101团1营1连',
              children: [
                {
                  id: '1-1-1-1-1',
                  label: '战士小王'
                },
                {
                  id: '1-1-1-1-2',
                  label: '战士小李'
                },
                {
                  id: '1-1-1-1-3',
                  label: '战士小张'
                },
                {
                  id: '1-1-1-1-4',
                  label: '战士小王'
                },
                {
                  id: '1-1-1-1-5',
                  label: '战士小李'
                },
                {
                  id: '1-1-1-1-6',
                  label: '战士小张'
                }
              ]
            },
            {
              id: '1-1-1-2',
              label: '1101团1营2连'
            },
            {
              id: '1-1-1-3',
              label: '1101团1营3连'
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
