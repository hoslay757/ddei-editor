export default {
  'id': '303014',
  'name': 'ddei.uml.role',
  'code': 'actor',
  'desc': '角色',
  'from': '103006',

  'define': {
    //初始化时合并
    initMerges: [0],
    iconPos: {
      dy: -10
    }
  },
  //其它同时创建的平级控件
  others: [
    {
      'id': '100002',
      'define': {
        width: 100,
        height: 25,
        font: {
          size: 16,
        },
        text: "Actor",
        fill: { type: 0 },
        border: { type: 0 },
        initCPV: {
          x: 0, y: 60
        }
      }
    },
  ]

}
