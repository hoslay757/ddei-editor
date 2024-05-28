export default {
  'id': '308011',
  'name': '接收事件',
  'code': 'recevt',
  'desc': '接收事件',
  'from': '103007',

  'define': {
    width: 70,
    height: 70,
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            }
          ]
        },

      ]
    }
  }
}
