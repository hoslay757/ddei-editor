export default {
  'id': '104111',
  'name': '中括号',
  'code': 'bm',
  'desc': '由极坐标系构造的右中括号，不带任何文本',
  'from': '100500',

  'define': {
    width: 50,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
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
            let rad1 = (72+deltaRotate) * DDeiConfig.ROTATE_UNIT
            let rad2 = (-72+deltaRotate) * DDeiConfig.ROTATE_UNIT
            let rad0 = (deltaRotate) * DDeiConfig.ROTATE_UNIT
            let x0 = sample.r * Math.cos(rad0)
            let y0 = sample.r * Math.sin(rad0)
            let x1 = sample.r * Math.cos(rad1)
            let y1 = sample.r * Math.sin(rad1)
            let x2 = sample.r * Math.cos(rad2)
            let y2 = sample.r * Math.sin(rad2)
            pvs.push({begin:1,x:x2,y:y2});
            pvs.push({x:x0,y:y2,stroke:1});
            pvs.push({x:x0,y:y1,stroke:1});
            pvs.push({x:x1,y:y1,stroke:1});


            pvs.push({x:x1,y:y1,type:0,oppoint:1,select:1});
            pvs.push({x:x2,y:y2,type:0,oppoint:1,select:1});

            pvs.push({x:x0,y:0,type:0,oppoint:1});
            pvs.push({x:x2,y:0,type:0,oppoint:1});
            pvs.push({x:x0,y:y2,type:0,select:1});
            pvs.push({x:x0,y:y1,type:0,select:1});
          }
        }`,
      ]
    },
    ext: {
      /**
       * 定义分组，用于属性编辑
       */
      groups: [
        {
          name: "样式",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "线条",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            }
          ]
        }
      ]
    }
  }
}
