export default {
  'id': '306009',
  'name': '消息',
  'code': 'msg',
  'desc': '消息',
  'from': '306004',

  define: {
    pvs: [
      { x: 0, y: 0, z: 1 },
      { x: 0, y: -50, z: 1 },
    ],
    iLinkModels: {
      "0": { type: 3, dx: 60, dy: 0 }
    },
    iconPos: {
      dy: 50,
      dx: -50
    }
  },
  others:
    [
      {
        'id': '100002',
        'define': {
          width: 100,
          height: 20,
          text: "Operation A()",
          fill: { type: 0 },
          border: { type: 0 },
          initCPV: {
            x: 65, y: -25
          }
        }
      },
    ]
}
