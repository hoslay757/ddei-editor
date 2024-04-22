export default {
  'id': '100110',
  'name': '半圆',
  'code': 'hcircle',
  'desc': '由极坐标系构造的半圆形',
  'from': '100500',


  'define': {
    width: 100,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      eqrat: 1,
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 45,
      //半径距离
      r: 50,
      //方向,上右下左1,2,3,4
      direct: 2,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            let deltaRotate = 0
            switch(sample.direct){
              case 1:
                deltaRotate = -90  
              break;
              case 3:
                 deltaRotate = -270  
                break;
              case 4:
                deltaRotate =  -180    
              break;
            }
            let rad1 = (90+deltaRotate) * DDeiConfig.ROTATE_UNIT
            let rad2 = (-90+deltaRotate) * DDeiConfig.ROTATE_UNIT
            let rad0 = (deltaRotate) * DDeiConfig.ROTATE_UNIT
            let x0 = sample.r * Math.cos(rad0)
            let y0 = sample.r * Math.sin(rad0)
            let x1 = sample.r * Math.cos(rad1)
            let y1 = sample.r * Math.sin(rad1)
            let x2 = sample.r * Math.cos(rad2)
            let y2 = sample.r * Math.sin(rad2)
            pvs.push({begin:1,x:x2,y:y2,r:sample.r,rad:rad2,stroke:1,type:2,direct:1});
            pvs.push({x:x2,y:y2,r:sample.r,rad:rad1,stroke:1,type:2,direct:1});
            pvs.push({x:x2,y:y2});
            pvs.push({end:1,x:0,y:0});
            pvs.push({x:x1,y:y1,type:0,oppoint:1});
            pvs.push({x:x2,y:y2,type:0,oppoint:1});

            pvs.push({x:x0,y:0,type:0,oppoint:1});
            pvs.push({x:x2,y:0,type:0,oppoint:1});
            pvs.push({x:x0,y:y2,type:0});
            pvs.push({x:x0,y:y1,type:0});
          }
        }`,
        //选中区域
        `(i, sample, pvs, model, ovs){
            let er  = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({x:x,y:y,r:er,select:1});
        }`,
      ],

    },
    iconPos: {
      dx: -50
    }
  }
}
