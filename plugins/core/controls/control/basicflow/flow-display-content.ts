export default {
  'id': '102056',
  'name': 'ddei.control.display',
  'code': 'fdc',
  'desc': '显示内容',
  'from': '100500',

  'define': {
    width: 80,
    height: 80,
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
            pvs.push({begin:1,x:135,y:50,select:1,clip:1})
            pvs.push({x:-135,y:50,select:1,clip:1})
            pvs.push({x:-135,y:-50,select:1,clip:1})
            pvs.push({end:1,x:135,y:-50,select:1,clip:1})
          }
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({begin:1,x:65,y:0,oppoint:1})
            pvs.push({x:0,y:50,oppoint:1})
            pvs.push({x:-135,y:0,oppoint:1})
            pvs.push({end:1,x:0,y:-50,oppoint:1})
          }
        }`,
        //绘制线段区域
        `(i, sample, pvs, model, ovs){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad = (sample.sita+45) * DDeiConfig.ROTATE_UNIT
            let x = er * Math.cos(rad)
            let y = er * Math.sin(rad)
            let rad90 = 90 * DDeiConfig.ROTATE_UNIT
            switch(i){
              case 0:
                pvs.push({begin:1,x:x-10,y:y,fill:1,stroke:1,r:er,rad:0});
              break;
              case 1:
                pvs.push({x:x,y:y,fill:1,stroke:1});
              break;
              case 2:
                pvs.push({x:-135,y:0,fill:1,stroke:1});
                pvs.push({x:x,y:y,fill:1,stroke:1});
              break;
              case 3:
                pvs.push({x:x-10,y:y,fill:1,stroke:1,r:er,rad:-rad90,rd:0});
                pvs.push({r:er,dx:40,rad:rad90,stroke:1,type:4,direct:1,end:1});
                pvs.push({r:25});
                pvs.push({r:sample.r});
              break;
            }
        }`,

        //文本区域
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({begin:1,x:50,y:50,text:1})
            pvs.push({x:-50,y:50,text:1})
            pvs.push({x:-50,y:-50,text:1})
            pvs.push({end:1,x:50,y:-50,text:1})
          }
        }`,
      ],

    },
    iconPos: {
      dx: 20,
      dw: 10,
    },
    border: {
      round: 5
    }
  }
}
