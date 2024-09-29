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

          // type: 5, //不允许移动，固定路径位置，沿路径方向，固定在等比例或者等长度位置（长度不足则按照0.5比例位置）
          // pvs: ["pvs[0]","pvs[1]"],//定义路径
          // rate:0.5, //固定比例
          // len: 0       //固定长度
        },
        //联动，点移动后控制的其它点
        links: [
          {
            type: 1,//1施加矩阵
            // type:2,//同步中心点
            pvs: ["composes[0]"]
          }
        ]
      }
    ]

  }
}
