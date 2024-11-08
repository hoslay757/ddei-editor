export default {
  'id': '303001',
  'name': 'ddei.uml.objlife',
  'code': 'obj',
  'desc': '对象生命线',
  'from': '100000',

  'define': {
    create: false,
    initMerges: [0, 1],
    iconPos: {
      dy: -150
    }
  },
  //其它同时创建的平级控件
  others: [
    {
      'id': '303003',
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
