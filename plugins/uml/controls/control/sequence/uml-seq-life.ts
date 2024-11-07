export default {
  'id': '303002',
  'name': 'ddei.uml.life',
  'code': 'life',
  'desc': '生命线',
  'from': '100401',

  'define': {
    type: 1,
    ep: {
      type: -1
    },
    dash: [20, 10],
    border: {
      width: 2
    },
    pvs: [
      { x: 0, y: -225, z: 1 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 225, z: 1 },
    ],

    //线段本身的一些限制
    constraint: {
      ep: {
        //只允许开始节点创建链接
        link: false,
      },
      type: {
        //直线的情况下，开始节点和结束节点的角度限制范围（旋转后则为角度+rotate）
        "1": {
          //限制角度区间
          angles: [[90, 90], [0, 0], [180, 180], [-90, -90]],

        }
      }
    }


  }
}
