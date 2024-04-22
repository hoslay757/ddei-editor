export default {
  'id': '102058',
  'name': '控制传递',
  'code': 'ctran',
  'desc': '控制传递',
  'from': '100401',

  'define': {
    type: 2,
    ep: {
      type: 1
    },
    pvs: [
      { x: -75, y: 0, z: 1 },
      { x: 0, y: 0, z: 1 },
      { x: 75, y: 0, z: 1 },
    ],
    cpv: {
      x: 0, y: 0
    },
    //组合控件
    composes: [
      {
        width: 30,
        height: 30,
        id: '100120',
        cIndex: 1,
        initCPV: {
          x: 0, y: 0, z: 1
        }
      },
    ],
    //操作点
    ovs: [
      {
        x: 0, y: 0, ix: 0, iy: 0,
        //约束，控制点的移动路径和位置
        constraint: {
          type: 1,//跟随线段
          pvs: ["pvs"]//当前对象的pvs
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
