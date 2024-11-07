export default {
  'id': '102090',
  'name': '结束',
  'code': 'end',
  'desc': '流程的开始节点',
  'from': '102001',

  'define': {
    width: 40,
    height: 40,
    fill: {
      color: 'black'
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
            },
          ]
        },

      ]
    }
  }
}
