export default {
  'id': '301003',
  'name': 'ddei.uml.state',
  'code': 'state',
  'desc': 'UML的状态机节点',
  'from': '100009',

  'define': {
    width: 140,
    height: 90,

    border: {
      round: 5
    },

    ext: {
      sample: {
        //分割横线的纵坐标
        pvalue: -20,
      },
      groups: [
        {
          name: "属性",
          icon: 'icon-fill',
          subGroups: [

            {
              name: "ddei.style",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity", "border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
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
        width: 136,
        height: 24,
        cIndex: 2,
        id: '100002',
        border: {
          type: 0
        },
        fill: {
          type: 0
        },
        textStyle: {
          align: 3,
        },
        text: "Name",
        initCPV: {
          x: 0, y: -31.5
        },
        attrLinks: [
          { code: "textStyle", mapping: ["*"] },
          { code: "font", mapping: ["*"] },
        ]
      },
      {
        width: 136,
        height: 60,
        cIndex: 2,
        id: '100002',
        textStyle: {
          align: 3,
          feed: 1
        },
        border: {
          type: 0
        },
        fill: {
          type: 0,
        },
        text: "Activities",
        initCPV: {
          x: 0, y: 13.5
        },
        attrLinks: [
          { code: "textStyle", mapping: ["*"] },
          { code: "font", mapping: ["*"] },
        ]
      },
    ]
  }

}
