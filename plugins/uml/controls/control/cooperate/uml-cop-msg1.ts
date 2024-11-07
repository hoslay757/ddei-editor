export default {
  'id': '306004',
  'name': 'ddei.uml.msg',
  'code': 'msg',
  'desc': '消息',
  'from': '306003',

  define: {
    ep: {
      type: 51,
      weight: 15
    },
    iLinkModels: {
      "0": { type: 3, dx: -135, dy: 0 }
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
            x: -60, y: 0
          }
        }
      },
    ]
}
