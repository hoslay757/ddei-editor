export default {
  'id': '100012',
  'name': '直角三角形',
  'code': 'triangle',
  'desc': '由三个点构成的三角形',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      //一圈1次采样
      loop: 1,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
            pvs.push({begin:1,x:50,y:50,select:1,clip:1});
            pvs.push({x:-50,y:50,select:1,clip:1});
            pvs.push({x:-50,y:-50,select:1,clip:1});
            pvs.push({end:1,x:50,y:-50,select:1,clip:1});
        }`,
        `(i, sample, pvs, model, ovs){
            pvs.push({begin:1,x:50,y:50,oppoint:2,align:1,stroke:1,fill:1});
            pvs.push({x:-50,y:50,oppoint:2,align:1,stroke:1,fill:1});
            pvs.push({end:1,x:50,y:-50,oppoint:2,op2close:1,align:1,stroke:1,fill:1});
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({begin:1,x:50,y:50,text:1});
            pvs.push({x:0,y:50,text:1});
            pvs.push({x:0,y:0,text:1});
            pvs.push({end:1,x:50,y:0,text:1});
          }
        }`,

      ]
    }
  }
}
