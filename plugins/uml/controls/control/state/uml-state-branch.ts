export default {
  'id': '301012',
  'name': '分叉',
  'code': 'branch',
  'desc': 'UML的状态的分叉',
  'from': '100002',
  
  'define': {
    width: 100,
    height: 10,
    border: {
      width: 0,
      round: 2
    },
    fill: {
      color: "#017fff"
    },
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
            },
          ]
        },

      ]
    }
  }
}
