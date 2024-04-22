export default {
  'id': '100001',
  'name': '正方形-带文本',
  'code': 'square',
  'desc': '由4个点组成的正方形',
  'from': '100000',
  'icon': 'toolbox-shape-square',
  'define': {
    ext: {
      sample: {
        //采样的规则，多组采样返回多组规则
        rules: [
          `(i, sample, pvs, model, ovs){
            let start = 0,end = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
                pvs[0].y=sample.y
              break;
              case 2:
                pvs[1].x=sample.x
              break;
              case 3:
                pvs[2].y=sample.y 
                sample.x = pvs[0].x
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,text:1});
        }`

        ]
      }
    }
  }
}
