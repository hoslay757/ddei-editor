export default {
  'id': '302013',
  'name': 'ddei.uml.ext',
  'code': 'ext',
  'desc': '扩展',
  'from': '100401',

  'define': {
    type: 2,
    dash: [10, 10],
    ep: {
      type: 1
    },
    pvs: [
      { x: -75, y: 0, z: 1 },
      { x: 0, y: 0, z: 1 },
      { x: 75, y: 0, z: 1 },
    ],
    iLinkModels: {
      "0": { type: 3, dx: 0, dy: -10 }
    }
  },
  //其它同时创建的平级控件
  others: [
    {
      'id': '100002',
      'define': {
        width: 100,
        height: 20,
        text: "<<extend>>",
        fill: { type: 0 },
        border: { type: 0 },
        initCPV: {
          x: 0, y: -10
        }
      }
    },
  ]
}