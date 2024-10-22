export default {
  'id': '104105',
  'name': '小括号',
  'code': 'bst',
  'desc': '左右小括号，带文本编辑',
  'from': '100500',

  'define': {
    width: 160,
    height: 100,
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
        //选中区域
        `(i, sample, pvs, model, ovs){
          let start = 0,end = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
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
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,select:1,oppoint:2,op2close:i == 3 ? 1 : 0,clip:1});
        }`
      ],

    },


    //组合控件
    composes: [
      {
        width: 30,
        height: 100,
        id: '104102',
        cIndex: 2,
        initCPV: {
          x: -65, y: 0, z: 1
        },
        attrLinks: [
          { code: "border", mapping: ["*"] },
        ]
      },
      {
        width: 30,
        height: 100,
        id: '104101',
        cIndex: 2,
        initCPV: {
          x: 65, y: 0, z: 1
        },
        attrLinks: [
          { code: "border", mapping: ["*"] },
        ]
      },
      {
        width: 140,
        height: 95,
        id: '100002',
        cIndex: 1,
        initCPV: {
          x: 0, y: 0, z: 1
        },
        border: {
          type: 0
        },
        fill: {
          type: 0
        },
        textStyle: {
          feed: 1,
          scale: 1,
        },
        attrLinks: [
          { code: "textStyle", mapping: ["*"] },
          { code: "font", mapping: ["*"] }
        ]
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
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
