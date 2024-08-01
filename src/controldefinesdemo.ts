//控件定义
const controls: object[] = [
  {
    'id': '9999001',
    'name': '自定义1',
    'code': 'cust_1',
    'desc': '自定义节点1',
    'from': '302006',
    'define': {
      fill: {
        color: "#e1b348"
      }
    }
  },
  {
    'id': '9999002',
    'name': '自定义2',
    'code': 'cust_2',
    'desc': '自定义节点2',
    'from': '302006',
    'define': {
      fill: {
        color: "#ffc0be"
      }
    }
  }
]

//分组定义
const groups: object[] = [
  {
    id: '999',
    name: '自定义扩展',
    code: 'custom-group',
    desc: '自定义扩展分组',
    subject: 'custom',
    orderNo: 0,
    controls: [
      {
        'id': '302002',
        'name': '扩展用例',
      },
      {
        'id': '9999001',
        'name': '自定义1'
      },
      {
        'id': '9999002',
        'name': '自定义2'
      },
      {
        'id': '302007',
        'name': '扩展用例',
      }
    ]
  }
]

export { controls,groups}
