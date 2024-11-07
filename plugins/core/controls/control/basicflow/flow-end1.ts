export default {
  'id': '102091',
  'name': '结束',
  'code': 'end',
  'desc': '流程的开始节点',
  'from': '100003',

  'define': {
    width: 40,
    height: 40,
    cIndex: 1,
    composes: [
      {
        id: "102090",
        width: 30,
        height: 30,
        cIndex: 2,
        attrLinks: [
          { code: "fill", mapping: ["*"] },
          { code: "border", mapping: ["*"] },
        ]
      }
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
          ]
        },

      ]
    }
  }
}
