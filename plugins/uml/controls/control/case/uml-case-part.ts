export default {
  'id': '302004',
  'name': 'ddei.uml.participal',
  'code': 'parti',
  'desc': 'UML的用例图参与者',
  'from': '100009',

  'define': {
    width: 140,
    height: 90,
    ext: {
      sample: {
        //分割横线的纵坐标
        pvalue: -20,
      },
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
        text: "<<actor>>",
        initCPV: {
          x: 0, y: -31.5
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
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
        text: "ddei.uml.syspart",
        initCPV: {
          x: 0, y: 13.5
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
    ]
  }

}
