export default {
  'id': '303018',
  'name': '控制',
  'code': 'control',
  'desc': '控制',
  'from': '100500',

  'define': {
    width: 60,
    height: 60,
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
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
            let er  = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT) + 2
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({x:x,y:y,r:er,select:1});
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
            let x = sample.r  * Math.cos((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            let y = sample.r  * Math.sin((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            pvs.push({x:x,y:y,r:sample.r ,oppoint:1});
            if(i == 3){
              pvs.push({x:0,y:0,r:sample.r ,oppoint:3});
            }
        }`,
        //绘制线段、填充区域
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({r:sample.r,stroke:1,fill:1,begin:1,end:1});
            }
        }`,
        //上方箭头
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({begin:1,x:0,y:-50,type:1,stroke:1});
              pvs.push({x:7.5,y:-56.5,type:1,stroke:1});
              pvs.push({x:0,y:-50});
              pvs.push({x:6.5,y:-42.5,type:1,stroke:1});
              pvs.push({end:1,x:0,y:-50,type:1,stroke:1});
            }
        }`,
      ]
    },
    iconPos: {
      dy: -10
    },
    ext: {
      groups: [
        {
          name: "ddei.style",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "ddei.fill",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            },
            {
              name: "ddei.line",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            }
          ]
        },

      ]
    }

  },
  //其它同时创建的平级控件
  others: [
    {
      'id': '100002',
      'define': {
        width: 100,
        height: 25,
        text: "Control",
        fill: { type: 0 },
        border: { type: 0 },
        initCPV: {
          x: 0, y: 42
        }
      }
    },
  ]

}
