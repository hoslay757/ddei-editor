export default {
  'id': '102050',
  'name': '循环界限',
  'code': 'fla',
  'desc': '流程的循环界限',
  'from': '100500',

  'define': {
    width: 110,
    height: 70,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let weight = 20
            switch(i){
              case 0:
                pvs.push({begin:1,x:sample.x,y:sample.y,select:1,clip:1,text:1,oppoint:2,stroke:1,fill:1});
              break;
              case 1:
                pvs[0].y=sample.y
                pvs.push({x:sample.x,y:sample.y,select:1,clip:1,text:1,stroke:1,oppoint:2,fill:1});
              break;
              case 2:
                pvs[1].x=sample.x
                pvs.push({x:sample.x,y:sample.y,select:1,clip:1,text:1,stroke:1,oppoint:2,fill:1});
              break;
              case 3:
                pvs[2].y=sample.y+weight
                pvs.push({x:pvs[2].x+weight,y:sample.y,select:1,clip:1,stroke:1,oppoint:2,fill:1});
                sample.x = pvs[0].x
                pvs.push({x:sample.x-weight,y:sample.y,select:1,clip:1,stroke:1,oppoint:2,fill:1});
                pvs.push({x:sample.x,y:sample.y+weight,select:1,clip:1,text:1,stroke:1,oppoint:2,op2close:1,fill:1,end:1});
               
              break;
            }
            
        }`

      ]
    }
  }
}
