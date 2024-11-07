export default {
  'id': '100200',
  'name': 'ddei.control.text',
  'code': 'text',
  'desc': '跟随内容变化大小的文本',
  'from': '100002',
  'define': {
    borderType: 0,
    border: {
      type: 0,
      selected: {
        type: 1,
        dash: [5, 5],
        width: 1
      }
    },
    fill: {
      type: 0
    },
    text: "ddei.property.text",
    ext: {
      /**
       * 定义分组，用于属性编辑
       */
      groups: [
        {
          name: "ddei.style",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "ddei.text",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.lockWidth","textStyle.paddingWeight", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
            {
              name: "ddei.border",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            },
            {
              name: "ddei.fill",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            }

          ]
        },
        {
          name: "ddei.data",
          icon: 'icon-edit-properies',
          subGroups: [
            {
              name: "ddei.basic",
              attrs: ["code", "text", "fmt.type", "fmt.nscale", "fmt.tmark", "fmt.mmark", "fmt.munit", "fmt.mrmb", "fmt.dtype", "fmt.format"]
            },

          ]
        },


      ],
      attrs: [
        {
          'code': 'textStyle.paddingWeight',
          'name': 'ddei.property.paddingWeight',
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
          'name': 'ddei.property.outSize',
          'desc': '文本的超出范围后的策略',
          'controlType': 'radio',
          'dataType': 'string',
          'dataSource': [{ 'text': 'ddei.property.ds.hidden', 'value': '0' }, { 'text': 'ddei.property.ds.ellipsis', 'value': '2' }, { 'text': 'ddei.property.ds.narrow', 'value': '1' }, { 'text': 'ddei.property.ds.ext', 'value': '3' }],
          'defaultValue': 3,
          'cascadeDisplay': { 3: { show: ['textStyle.lockWidth', "textStyle.paddingWeight"], hidden: [] }, default: { show: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, empty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, notempty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] } }
        }
      ]
    }
  },

}
