export default {
  'id': '305001',
  'name': '组件',
  'code': 'cmp',
  'desc': 'UML的组件节点',
  'from': '100500',
  'icon': 'toolbox-shape-square',
  'define': {
    width: 120,
    height: 75,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,

    //采样信息
    sample: {
      eqrat: false,
      //允许文本输入
      textInput: 1,
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
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
            pvs.push({begin:start,end:end,x:x,y:y,select:1});
        }`,
        //线段与填充区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
 
            pvs.push({begin:1,x:50,y:50,stroke:1,oppoint:2,fill:1});

            pvs.push({x:-37.5,y:50,stroke:1,oppoint:2,fill:1});

            pvs.push({x:-37.5,y:34,stroke:1,fill:1});
            pvs.push({x:-25,y:34,stroke:1,fill:1});
            pvs.push({x:-25,y:16,stroke:1,fill:1});
            pvs.push({x:-37.5,y:16,stroke:1,fill:1});


            pvs.push({x:-37.5,y:-16,stroke:1,fill:1});
            pvs.push({x:-25,y:-16,stroke:1,fill:1});
            pvs.push({x:-25,y:-34,stroke:1,fill:1});
            pvs.push({x:-37.5,y:-34,stroke:1,fill:1});
            
            pvs.push({x:-37.5,y:-50,stroke:1,fill:1,oppoint:2});
    
            pvs.push({end:1,x:50,y:-50,stroke:1,fill:1,oppoint:2,op2close:1});

          }
            
        }`,
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({begin:1,x:-50,y:34,stroke:1,fill:1});
            pvs.push({x:-25,y:34,stroke:1,fill:1});
            pvs.push({x:-25,y:16,stroke:1,fill:1});
            pvs.push({x:-50,y:16,stroke:1,fill:1,end:1});
            pvs.push({x:-50,y:25,type:0,oppoint:1});
          }   
        }`,
        `(i, sample, pvs, model, ovs){
          if(i == 0){ 
            pvs.push({begin:1,x:-50,y:-34,stroke:1,fill:1});
            pvs.push({x:-25,y:-34,stroke:1,fill:1});
            pvs.push({x:-25,y:-16,stroke:1,fill:1});
            pvs.push({x:-50,y:-16,stroke:1,fill:1,end:1});
            pvs.push({x:-50,y:-25,type:0,oppoint:1});
          }   
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
          if(sample.textInput && i == 0){
 
            pvs.push({begin:1,x:50,y:50,text:1});

            pvs.push({x:-25,y:50,text:1});

            pvs.push({x:-25,y:-50,text:1});
    
            pvs.push({end:1,x:50,y:-50,text:1});

          }
            
        }`,

      ]
    }
  }

}
