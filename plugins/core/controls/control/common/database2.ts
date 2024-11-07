export default {
  'id': '103012',
  'name': 'ddei.database',
  'code': 'database',
  'desc': '数据库图标',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
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
        //选中区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            let dn = 12;
            pvs.push({begin:1,x:50,y:50,select:1,clip:1})
            pvs.push({x:-50,y:50,select:1,clip:1})
            pvs.push({x:-50,y:-50-dn,select:1,clip:1})
            pvs.push({end:1,x:50,y:-50-dn,select:1,clip:1})
          }
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            let dn = 12;
            pvs.push({begin:1,x:50,y:0,oppoint:1})
            pvs.push({x:0,y:56,oppoint:1})
            pvs.push({x:-50,y:0,oppoint:1})
            pvs.push({end:1,x:0,y:-50-dn,oppoint:1})
          }
        }`,
        //绘制线段区域
        `(i, sample, pvs, model, ovs){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad = (sample.sita+45) * DDeiConfig.ROTATE_UNIT
            let x = er * Math.cos(rad)
            let y = er * Math.sin(rad)
            let rad180 = 0
            switch(i){
              case 0:
                pvs.push({begin:1,x:x,y:y,fill:1,r:er,rad:0,strokeClear:1});
              break;
              case 1:
                rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({r:er,dy:35,rad:rad180,stroke:1,type:4,direct:1});
                pvs.push({r:sample.r});
                pvs.push({r:20});
                pvs.push({x:pvs[0].x,y:pvs[0].y});
                pvs.push({x:x,y:y});
              break;
              case 2:
                rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({x:x,y:y,stroke:1,rad:rad180,r:er});
              break;
              case 3:
                rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({r:er,dy:-40,rad:0,stroke:1,type:4,direct:1});
                pvs.push({r:sample.r});
                pvs.push({r:25});
                pvs.push({end:1,x:pvs[0].x,y:pvs[0].y,stroke:1});
              break;
            }
        }`,



        // 上方的下半椭圆
        `(i, sample, pvs, model, ovs){
          if(i == 2 || i ==3){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad = (sample.sita+45) * DDeiConfig.ROTATE_UNIT
            let x = er * Math.cos(rad)
            let y = er * Math.sin(rad)
            switch(i){
              case 2:
                let rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({begin:1,x:x,y:y,r:er,rad:rad180,strokeClear:1});
              break;
              case 3:
                pvs.push({r:er,dy:-40,rad:0,stroke:1,type:4,direct:0});
                pvs.push({r:sample.r});
                pvs.push({r:25});
                pvs.push({end:1,x:x,y:y});
              break;
            }
          }
        }`,
        // 上方的下半椭圆
        `(i, sample, pvs, model, ovs){
          if(i == 2 || i ==3){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad = (sample.sita+45) * DDeiConfig.ROTATE_UNIT
            let x = er * Math.cos(rad)
            let y = er * Math.sin(rad)
            switch(i){
              case 2:
                let rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({begin:1,x:x,y:y,r:er,rad:rad180,strokeClear:1});
              break;
              case 3:
                pvs.push({r:er,dy:-12,rad:0,stroke:1,type:4,direct:0});
                pvs.push({r:sample.r});
                pvs.push({r:20});
                pvs.push({end:1,x:x,y:y});
              break;
            }
          }
        }`,
        // 上方的下半椭圆
        `(i, sample, pvs, model, ovs){
          if(i == 2 || i ==3){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad = (sample.sita+45) * DDeiConfig.ROTATE_UNIT
            let x = er * Math.cos(rad)
            let y = er * Math.sin(rad)
            switch(i){
              case 2:
                let rad180 = 180 * DDeiConfig.ROTATE_UNIT
                pvs.push({begin:1,x:x,y:y,r:er,rad:rad180,strokeClear:1});
              break;
              case 3:
                pvs.push({r:er,dy:12,rad:0,stroke:1,type:4,direct:0});
                pvs.push({r:sample.r});
                pvs.push({r:20});
                pvs.push({end:1,x:x,y:y});
              break;
            }
          }
        }`,
      ]
    },
    border: {
      width: 10,
    },
    fill: {
      color: "#017fff"
    }
  }
}
