export default {
  'id': '103005',
  'name': 'ddei.control.comment',
  'code': 'comment',
  'desc': '注释备注',
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
      //允许文本输入
      textInput: 1,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let weight = 20
          let x=sample.x,y=sample.y
            switch(i){
              case 0:
                pvs.push({begin:1,x:x,y:y,select:1,clip:1,oppoint:2,stroke:1,fill:1});
              break;
              case 1:
                pvs[0].y=y
                pvs.push({x:x,y:y,select:1,clip:1,stroke:1,oppoint:2,fill:1});
              break;
              case 2:
                pvs[1].x=x
                pvs.push({x:x,y:y,select:1,clip:1,stroke:1,oppoint:2,fill:1});
              break;
              case 3:
                pvs[2].y=y
                x = pvs[0].x
                pvs.push({x:x-weight,y:y,select:1,clip:1,stroke:1,oppoint:2,fill:1});
                pvs.push({x:x,y:y+weight,select:1,clip:1,stroke:1,oppoint:2,op2close:1,fill:1,end:1});
               
              break;
            }
        }`,
        `(i, sample, pvs, model, ovs){
          if(i==3){
            pvs.push({x:30,y:sample.y,stroke:1,type:1,begin:1});
            pvs.push({x:30,y:sample.y+20,stroke:1,type:1});  
            pvs.push({x:50,y:sample.y+20,stroke:1,type:1});  
            pvs.push({x:50,y:sample.y+20,end:1});  
          }
        }`,
        //文本
        `(i, sample, pvs, model, ovs){
          if(sample.textInput){
            let weight = 20
            let x=sample.x,y=sample.y
              switch(i){
                case 0:
                  pvs.push({begin:1,x:x,y:y,text:1});
                break;
                case 1:
                  pvs[0].y=y
                  pvs.push({x:x,y:y,text:1});
                break;
                case 2:
                  pvs[1].x=x
                  pvs.push({x:x,y:y,text:1});
                break;
                case 3:
                  pvs[2].y=y+weight
                  x = pvs[0].x
                  pvs.push({x:x,y:pvs[2].y,text:1});
                break;
              }
            }
        }`,

      ]
    }
  }
}
