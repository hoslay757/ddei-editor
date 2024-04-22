export default {
  'id': '305005',
  'name': '组件盒',
  'code': 'cbox',
  'desc': 'UML的组件盒节点',
  'from': '100008',
  'icon': 'toolbox-shape-square',
  'define': {
    width: 160,
    height: 100,
    text: "<<component>>",
    textStyle: {
      valign: 1,
      align: 3
    },
    ext: {
      sample: {
        rules: [
          //文本区域
          `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({begin:1,x:45,y:50,text:1});
              pvs.push({x:-45,y:50,text:1});
              pvs.push({x:-45,y:-17,text:1});
              pvs.push({end:1,x:45,y:-17,text:1});
            }
        }`,
        ]
      }
    },
    composes: [
      {
        width: 20,
        height: 20,
        cIndex: 2,
        id: '305101',
        sample: {
          textInput: 0,
        },
        initCPV: {
          x: 60, y: -32
        },
      },
    ]
  }

}
