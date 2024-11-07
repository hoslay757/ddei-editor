export default {
  'id': '100120',
  'name': 'ddei.control.arrow-right',
  'code': 'arr-r',
  'desc': '指向右边的箭头',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈12次采样
      loop: 12,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
            if(i % 4 == 0){
              let op2close = 0
              if(i == 8){
                op2close = 1
              }
              pvs.push({begin:i == 0,end:i == 8,x:sample.x,y:sample.y,select:1,clip:1,oppoint:2,op2close:op2close,stroke:1,fill:1});
            }
        }`
      ]
    }
  }
}
