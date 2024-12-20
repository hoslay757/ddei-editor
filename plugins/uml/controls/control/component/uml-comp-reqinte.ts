export default {
  'id': '305010',
  'name': 'ddei.uml.reqinte',
  'code': 'reqinte',
  'desc': '需求接口',
  'from': '100401',

  'define': {
    type: 2,
    ep: {
      type: -1
    },
    pvs: [
      { x: -75, y: 0, z: 1 },
      { x: 0, y: 0, z: 1 },
      { x: 75, y: 0, z: 1 },
    ],
    //组合控件
    composes: [
      {
        width: 25,
        height: 25,
        id: '100110',
        cIndex: 1,
        initCPV: {
          x: -75, y: 0, z: 1
        }
      },
    ],
    //操作点
    ovs: [
      {
        x: 0, y: 0, ix: 0, iy: 0,
        //约束，控制点的移动路径和位置
        constraint: {
          type: 0//不允许移动
        },
        //联动，点移动后控制的其它点
        links: [
          {
            type: 1,//1施加矩阵
            pvs: ["composes[0]"]
          }
        ]
      }
    ]

  }
}
