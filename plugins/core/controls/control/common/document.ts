export default {
  'id': '103003',
  'name': '文档',
  'code': 'doc',
  'desc': '文档',
  'from': '100500',
  'icon': 'toolbox-shape-square',
  'define': {
    width: 100,
    height: 60,
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
          let start = 0,end = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
                sample.y += 15
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
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,select:1});
        }`,
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            //从左下，左上，右上，右下，曲线：左下
            pvs.push({begin:1,x:-sample.x,y:sample.x,fill:1,clip:1});
            
            pvs.push({x:-sample.x,y:-sample.x,stroke:1,oppoint:2});
            pvs.push({x:sample.x,y:-sample.x,stroke:1,oppoint:2});
            pvs.push({x:sample.x,y:sample.x,stroke:1});
            //贝塞尔曲线，至少需要四个点，
            pvs.push({x:50,y:50,stroke:1,type:5});
            pvs.push({x:33,y:30});
            pvs.push({x:16,y:30});
            pvs.push({x:0,y:50});

            pvs.push({x:0,y:50,type:5,stroke:1,stroke:1,end:1});
            pvs.push({x:-17,y:70});
            pvs.push({x:-34,y:70});
            pvs.push({x:-50,y:50}); 
            pvs.push({x:-sample.x,y:0,type:0,oppoint:1});
            pvs.push({x:sample.x,y:0,type:0,oppoint:1});
            pvs.push({x:0,y:50,type:0,oppoint:1});
          }
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            //从左下，左上，右上，右下，曲线：左下
            pvs.push({begin:1,x:-sample.x,y:sample.x-15,text:1});
            pvs.push({x:-sample.x,y:-sample.x,text:1});
            pvs.push({x:sample.x,y:-sample.x,text:1});
            pvs.push({x:sample.x,y:sample.x-15,end:1,text:1});
          }
        }`

      ],

    },
    iconPos: {
      dh: 5
    }
  }
}
