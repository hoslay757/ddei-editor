export default {
  'id': '308008',
  'name': 'ddei.uml.sendsignal',
  'code': 'uasm',
  'desc': '发送信号',
  'from': '100500',

  'define': {
    width: 110,
    height: 70,
    //2为极坐标，缺省点为原点
    poly: 2,
    cIndex: 2,
    //采样信息
    sample: {
      //一圈采样次数
      loop: 4,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        //绘制线段区域
        `(i, sample, pvs, model, ovs){
            switch(i){
              case 0:
                pvs.push({begin:1,x:75,y:0,fill:1,clip:1,select:1,oppoint:2,stroke:1});
              break;
              case 1:
                pvs.push({x:50,y:50,fill:1,clip:1,text:1,select:1,oppoint:2,stroke:1});
                pvs.push({x:-50,y:50,fill:1,clip:1,text:1,select:1,oppoint:2,stroke:1});
              break;
              case 2:
                 pvs.push({x:-50,y:-50,fill:1,clip:1,text:1,select:1,oppoint:2,stroke:1});
              break;
              case 3:
               pvs.push({x:50,y:-50,fill:1,stroke:1,text:1,clip:1,oppoint:2,op2close:1,select:1,end:1});
              break;
            }
        }`,

      ]
    },
    iconPos: {
      dx: -20
    }
  }
}
