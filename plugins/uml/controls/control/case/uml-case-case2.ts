export default {
  'id': '302007',
  'name': '扩展用例',
  'code': 'case',
  'desc': 'UML的用例节点',
  'from': '100104',

  'define': {
    width: 140,
    height: 100,
    ext: {
      sample: {
        eqrat: false,
        //分割横线的纵坐标
        pvalue: -10,
      },
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            },
            {
              name: "文本",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
          ]
        },

      ]
    },
    //组合控件
    composes: [
      {
        width: 85,
        height: 24,
        cIndex: 2,
        id: '100002',
        border: {
          type: 0
        },
        fill: {
          type: 0
        },
        text: "用例",
        initCPV: {
          x: 0, y: -27.5
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
      {
        width: 90,
        height: 45,
        cIndex: 2,
        id: '100002',
        textStyle: {
          feed: 1
        },
        border: {
          type: 0
        },
        fill: {
          type: 0,
        },
        text: "扩展点",
        initCPV: {
          x: 0, y: 13
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
    ]
  }

}
