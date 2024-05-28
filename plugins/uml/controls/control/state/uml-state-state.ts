export default {
  'id': '301001',
  'name': '状态',
  'code': 'state',
  'desc': 'UML的状态机节点',
  'from': '100500',

  'define': {
    width: 110,
    height: 50,
    text: "State",
    font: {
      size: 14
    },
    border: {
      round: 10
    },
    textStyle: {
      align: 3
    },
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      eqrat: false,
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let start = 0,end = 0
          let x = sample.x,y = sample.y
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
                pvs[0].y=y
              break;
              case 2:
                pvs[1].x=x
              break;
              case 3:
                pvs[2].y=y
                x = pvs[0].x
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:x,y:y,select:1,clip:1,stroke:1,fill:1});
        }`,
        //定义锚点
        `(i, sample, pvs, model, ovs){
         
            switch(i){
              case 0:
                pvs.push({x:sample.x,y:sample.y-25,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y+25,type:0,oppoint:1});
              break;
              case 1:
                pvs.push({x:sample.x-25,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x+25,y:sample.y,type:0,oppoint:1});
              break;
              case 2:
                pvs.push({x:sample.x,y:sample.y-25,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y+25,type:0,oppoint:1});
              break;
              case 3:
                pvs.push({x:sample.x-25,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x,y:sample.y,type:0,oppoint:1});
                pvs.push({x:sample.x+25,y:sample.y,type:0,oppoint:1});
              break;
            }
        }`,

        //文本区域，右margin：5
        `(i, sample, pvs, model, ovs){
          let start = 0,end = 0
          let x = sample.x,y = sample.y
            switch(i){
              case 0:
                start = 1  
                x-=5
              break;
              case 1:
                pvs[0].y=y
              break;
              case 2:
                x+=5
                pvs[1].x=x
              break;
              case 3:
                pvs[2].y=y
                x = pvs[0].x
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:x,y:y,text:1});
        }`

      ]
    }
  }

}
