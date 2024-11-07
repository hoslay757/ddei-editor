export default {
  'id': '308011',
  'name': 'ddei.uml.recevent',
  'code': 'recevt',
  'desc': '接收事件',
  'from': '103007',

  'define': {
    width: 70,
    height: 70,
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
            }
          ]
        },

      ]
    }
  }
}
