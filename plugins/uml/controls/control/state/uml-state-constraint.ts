export default {
  'id': '301010',
  'name': '约束',
  'code': 'constr',
  'desc': 'UML的约束',
  'from': '103005',
  
  'define': {
    width: 140,
    height: 90,
    textStyle: {
      align: 3,
      feed: 1
    },
    text: ` Constraint Name :
Body`,
    composes: [
      {
        width: 90,
        height: 18,
        cIndex: 3,
        id: '100002',
        border: {
          type: 0
        },
        fill: {
          type: 0
        },
        textStyle: {
          align: 2,
        },
        text: "<<invariant>>",
        initCPV: {
          x: -15, y: -35
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
    ],
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
    }
  }
}
