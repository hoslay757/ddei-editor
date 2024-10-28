export default {
  'id': '104001',
  'name': '角度',
  'code': 'angle',
  'desc': '表示一个角度',
  'from': '100500',

  'define': {
    width: 200,
    height: 200,
    //2为极坐标，缺省点为原点
    poly: 2,
    font: {
      size: 10
    },
    //采样信息
    sample: {
      eqrat: true,
      //一圈采样次数
      loop: 1,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        //选择区域
        `(i, sample, pvs, model, ovs){
          let sita = Math.round(ovs[1].sita)
          let hdelta = (ovs[2].x-ovs[2].ovi.x)
          
            pvs.push({begin:1,x:hdelta,y:hdelta,select:1,clip:1});
            pvs.push({x:-hdelta,y:hdelta,select:1,clip:1});
            pvs.push({x:-hdelta,y:-hdelta,select:1,clip:1});
            pvs.push({x:hdelta,y:-hdelta,select:1,clip:1});
          
        }`,
        //下方直线
        `(i, sample, pvs, model, ovs){
          pvs.push({begin:1,x:0,y:0,stroke:1,oppoint:1,type:1});
          pvs.push({end:1,x:(ovs[2].x-ovs[2].ovi.x),y:0,stroke:1,oppoint:1,type:1});
        }`,
        //上方直线
        `(i, sample, pvs, model, ovs){
          let rad = (ovs[1].sita) * DDeiConfig.ROTATE_UNIT
          let hdelta = (ovs[2].x-ovs[2].ovi.x)
          let x = hdelta * Math.cos(rad)
          let y = hdelta * Math.sin(rad)
          pvs.push({begin:1,x:0,y:0,stroke:1,type:1});
          pvs.push({end:1,x:x,y:y,stroke:1,oppoint:1,type:1});
        }`,
        //弧线/直角线
        `(i, sample, pvs, model, ovs){
          let sita = ovs[1].sita
          if(Math.round(sita) == -90){
            let ar = (ovs[0].x-ovs[0].ovi.x)
            pvs.push({begin:1,x:0,y:-ar,stroke:1});
            pvs.push({x:ar,y:-ar,stroke:1});
            pvs.push({x:ar,y:0,stroke:1});
            pvs.push({end:1,x:0,y:0,stroke:1});
          }else{
            let rad = sita * DDeiConfig.ROTATE_UNIT
            let ar = (ovs[0].x-ovs[0].ovi.x)
            let x = ar * Math.cos(rad)
            let y = ar * Math.sin(rad)
            pvs.push({begin:1,x:ar,y:0,r:ar,rad:0,stroke:1});
            pvs.push({end:1,x:x,y:y,r:ar,rad:rad,stroke:1});
          }
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
          let sita = ovs[1].sita
          let disSita
          //显示半径
          let ar = (ovs[0].x-ovs[0].ovi.x)+7
          let dtSita = sita / 2
          
          let x = ar * Math.cos(dtSita * DDeiConfig.ROTATE_UNIT)
          let y = ar * Math.sin(dtSita * DDeiConfig.ROTATE_UNIT)
          if(sita<0 && sita >= -180){
            disSita = (-sita.toFixed(1))+""
          }else{
            x = -x
            y = -y
            disSita = (180+(180-sita)).toFixed(1)+""
          }
          let size = 10;
          pvs.push({begin:1,x:x+size,y:y+size/2,text:1});
          pvs.push({x:x-size,y:y+size/2,text:1});
          pvs.push({x:x-size,y:y-size/2,text:1});
          pvs.push({end:1,x:x+size,y:y-size/2,text:1});
          model.text = disSita
          model.render?.setCachedValue("text",disSita)
        }`,
      ],

    },
    iconPos: {
      dx: -50,
      dy: 50
    },
    //操作点定义
    ovs: [
      //控制角度显示位置
      {
        x: 25, y: 0, ix: 0, iy: 0,
        //约束，控制点的移动路径和位置
        constraint: {
          type: 2,//矩形范围
          x0: 0,
          x1: 50,
          y0: 0,
          y1: 0,
        }
      },
      //控制角度
      {
        //初始化的角度
        isita: 30,
        //约束，控制点的移动路径和位置
        constraint: {
          type: 3,//圆形范围
          r: 25
        }
      },
      {
        x: 50, y: 0, ix: 0, iy: 0,
        //约束，控制点的移动路径和位置
        constraint: {
          type: 2,//矩形范围
          x0: 5,
          x1: 100,
          y0: 0,
          y1: 0,
        }
      },
    ],
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
            },

            {
              name: "文本",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
          ]
        }
      ]
    }
  }
}
