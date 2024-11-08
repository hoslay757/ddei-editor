export default {
  'id': '103002',
  'name': 'ddei.control.human',
  'code': 'human',
  'desc': '人形图标',
  'from': '100500',

  'define': {
    width: 60,
    height: 85,
    //2为极坐标，缺省点为原点
    poly: 2,
    cIndex: 1,
    //采样信息
    sample: {
      //依附图形的初始化配置，如果产生依附图形，则会在配置的位置生成
      depPos: {
        type: 8
      },
      //一圈采样次数
      loop: 4,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
            let x = sample.x
            let y = sample.y
            switch(i){
              case 1:
                y = y-8
                pvs[0].y=y
              break;
              case 2:
                pvs[1].x=x
              break;
              case 3:
                y = y-8
                pvs[2].y=y
               x = pvs[0].x
              break;
            }
            pvs.push({begin:i==0,end:i==3,x:x,y:y,select:1,oppoint:2,op2close:i == 3 ? 1 : 0,clip:1});
        }`,

      ],

    },
    iconPos: {
      dy: 20
    },
    //组合控件
    composes: [
      {
        id: '100103',
        cIndex: 2,
        initCPV: {
          x: 0, y: -35
        },
        width: 35,
        height: 35
        , attrLinks: [
          { code: "border", mapping: ["*"] },
          { code: "fill", mapping: ["*"] },
        ]
      },
      {
        id: '100008',
        cIndex: 1,
        width: 60,
        height: 50,
        attrLinks: [
          { code: "border", mapping: ["*"] },
          { code: "fill", mapping: ["*"] },
        ]
      },
    ]
    , border: {
      round: 15
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
            },


          ]
        }
      ]
    }
  }
}
