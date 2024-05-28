export default {
  'id': '103006',
  'name': '人',
  'code': 'human',
  'desc': '人形图标',
  'from': '100500',

  'define': {
    width: 50,
    height: 100,
    //2为极坐标，缺省点为原点
    poly: 2,
    cIndex: 1,
    fill: {
      type: 0
    },
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
        `(i, sample, pvs, model, ovs){
            let x = sample.x
            let y = sample.y
            switch(i){
              case 1:
                pvs[0].y=y
              break;
              case 2:
                pvs[1].x=x
              break;
              case 3:
                pvs[2].y=y 
               x = pvs[0].x
              break;
            }
            pvs.push({begin:i==0,end:i==3,x:x,y:y,select:1,clip:1});
        }`,
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            
            let x = 0
            let y = -20
            pvs.push({begin:1,x:x,y:y,stroke:1});
            y = 10
            pvs.push({x:x,y:y,stroke:1});
            y += 10
            let y1= y
            let x1 = x
            pvs.push({x:x,y:y,stroke:1});
            let er = sample.r
            x = sample.x
            y = sample.y
            let y2 = er * Math.sin(90 * DDeiConfig.ROTATE_UNIT)
            pvs.push({x:x,y:y2,oppoint:1,stroke:1});
            pvs.push({x:x1,y:y1,type:3});
            let x3 = er * Math.cos(180 * DDeiConfig.ROTATE_UNIT)
            let y3 = er * Math.sin(180 * DDeiConfig.ROTATE_UNIT)
            pvs.push({x:x3,y:y2,oppoint:1,stroke:1});
            pvs.push({x:x1,y:y1,type:3});
            pvs.push({x:0,y:-10,type:3});
            pvs.push({x:x3,y:-10,oppoint:1,stroke:1});
            pvs.push({x:0,y:-10,type:3});
            pvs.push({x:x,y:-10,oppoint:1,stroke:1});
            pvs.push({x:0,y:-10,type:3});
          }
        }`,
        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({x:0,y:-50,oppoint:1,type:0});
          }
        }`
      ],

    },
    //组合控件
    composes: [
      {
        id: '100103',
        cIndex: 2,
        initCPV: {
          x: 0, y: -35
        },
        width: 30,
        height: 30,
        attrLinks: [
          { code: "border", mapping: ["*"] },
          { code: "fill", mapping: ["*"] },
        ]
      },
    ],
    ext: {
      groups: [
        {
          name: "样式",
          icon: 'icon-a-ziyuan375',
          subGroups: [
            {
              name: "填充",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            },
            {
              name: "线条",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
            },


          ]
        }
      ]
    }
  }
}
