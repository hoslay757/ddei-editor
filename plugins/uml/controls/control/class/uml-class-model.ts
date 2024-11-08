export default {
  'id': '307014',
  'name': 'ddei.uml.model',
  'code': 'model',
  'desc': 'UML的模型节点',
  'from': '305003',

  'define': {
    ext: {
      sample: {
        //新增一个三角形
        rules: [
          `(i, sample, pvs, model, ovs){
            let baseX = (ovs[1].x-ovs[1].ovi.x-50)-6
            let baseY = -50+(ovs[0].y-ovs[0].ovi.y)/2-4.5
            pvs.push({begin:1,x:baseX,y:baseY,stroke:1});
            pvs.push({x:baseX-4,y:baseY+8,stroke:1});
            pvs.push({end:1,x:baseX+4,y:baseY+8,stroke:1});
          }`,
        ]
      },
      composes: [
        {
          text: "ddei.uml.model",
          textStyle: {
            align: 1
          }
        },
        {
          text: ""
        }
      ]
    }
  }
}
