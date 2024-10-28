export default {
  'id': '100103',
  'name': '圆形',
  'code': 'circle',
  'desc': '由极坐标系构造的圆形',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      eqrat: 1,
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 45,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
            let er  = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({x:x,y:y,r:er,select:1});
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
            let x = sample.r  * Math.cos((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            let y = sample.r  * Math.sin((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            pvs.push({x:x,y:y,r:sample.r ,oppoint:1});
            if(i == 3){
              pvs.push({x:0,y:0,r:sample.r ,oppoint:3});
            }
        }`,
        //绘制线段、填充区域
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({r:sample.r,stroke:1,fill:1,clip:1,begin:1,end:1});
            }
        }`
      ]
    },
    ext: {
      groups: [
        {
          name: "样式",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "填充",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            },
            {
              name: "线条",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash"]
            }
          ]
        },
      ]
    }
  }
}
