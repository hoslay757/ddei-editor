export default {
  'id': '100200',
  'name': '文本',
  'code': 'text',
  'desc': '跟随内容变化大小的文本',
  'from': '100002',
  'define': {
    borderType: 0,
    border: {
      type: 0
    },
    fill: {
      type: 0
    },
    text: "文本",
    ext: {
      /**
       * 定义分组，用于属性编辑
       */
      groups: [
        {
          name: "样式",
          icon: 'icon-a-ziyuan375',
          subGroups: [
            {
              name: "文本",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.lockWidth", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
            {
              name: "边框",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            },
            {
              name: "填充",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            }

          ]
        },
        {
          name: "数据",
          icon: 'icon-edit-properies',
          subGroups: [
            {
              name: "数据属性",
              attrs: ["code", "text", "fmt.type", "fmt.nscale", "fmt.tmark", "fmt.mmark", "fmt.munit", "fmt.mrmb", "fmt.dtype", "fmt.format"]
            },

          ]
        },


      ],
      attrs: [
        {
          'code': 'textStyle.paddingWeight',
          'name': '间隔大小',
          'desc': '超范围自动扩展的情况下保留的宽度',
          'controlType': 'text',
          'dataType': 'integer',
          'defaultValue': 10,
          'hiddenTitle': true,
          'display': 'column',
          'type': [1, 2]
        },
        {
          'code': 'textStyle.scale',
          'name': '超出范围',
          'desc': '文本的超出范围后的策略',
          'controlType': 'radio',
          'dataType': 'string',
          'dataSource': [{ 'text': '隐藏', 'value': '0' }, { 'text': '省略', 'value': '2' }, { 'text': '缩小', 'value': '1' }, { 'text': '扩展', 'value': '3' }],
          'defaultValue': '3',
          'cascadeDisplay': { 3: { show: ['textStyle.lockWidth', "textStyle.paddingWeight"], hidden: [] }, default: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, empty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, notempty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] } }
        }
      ]
    }
  },

}
