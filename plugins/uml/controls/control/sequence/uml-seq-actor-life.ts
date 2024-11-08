export default {
  'id': '303015',
  'name': 'ddei.uml.rolelife',
  'code': 'actor',
  'desc': '角色生命线',
  'from': '100000',

  'define': {
    create: false,
    initMerges: [0, 1],
    ext: {
      //清空所有属性
      groups: [


      ]
    },
    iconPos: {
      dy: -150
    }
  },
  //其它同时创建的平级控件
  others: [
    {
      'id': '303014',
    },
    {
      'id': '303002',
      'define': {
        pvs: [
          { x: 0, y: 30, z: 1 },
          { x: 0, y: 450, z: 1 },
        ],
      }
    },
  ]

}
