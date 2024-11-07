export default {
  'id': '102092',
  'name': 'ddei.control.end',
  'code': 'end',
  'desc': '流程的开始节点',
  'from': '100003',

  'define': {
    width: 40,
    height: 40,
    fill: {
      color: 'red'
    },
    border: {
      type: 0
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
