export default {
  'id': '100003',
  'name': 'ddei.control.circle',
  'code': 'circle',
  'desc': '由极坐标系构造的圆形，带有text',
  'from': '100103',


  'define': {
    ext: {
      //采样信息
      sample: {
        //采样的规则，多组采样返回多组规则
        rules: [
          //文本区域
          `(i, sample, pvs, model, ovs){
            pvs.push({x:sample.x,y:sample.y,r:sample.r,text:1});
          }`,
        ]
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
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
