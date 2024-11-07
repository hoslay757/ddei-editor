export default {
  'id': '307013',
  'name': 'ddei.uml.overview',
  'code': 'overview',
  'desc': 'UML的概述节点',
  'from': '305003',

  'define': {
    ext: {
      composes: [
        {
          width: 100,
          height: 40,
          text: `<<profile>>
Package`,
          textStyle: {
            feed: 1,
            align: 1,
            scale: 1,
          },
          initCPV: {
            x: -50, y: -60
          }
        },
        {
          height: 120,
          text: ""
        },
      ],
      //操作点扩展
      ovs: [
        {
          x: -25, y: -25, ix: -25, iy: -50,
          constraint: {
            type: 2,
            x0: -25,
            x1: -25,
            y0: -50,
            y1: -20
          },
        },
        {
          x: 0, y: -37.5, ix: -50, iy: -37.5,
          constraint: {
            type: 2,
            x0: -50,
            x1: 50,
            y0: -37.5,
            y1: -37.5
          }
        }
      ]
    }
  }
}
