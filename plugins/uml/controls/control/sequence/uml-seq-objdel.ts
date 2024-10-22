export default {
  'id': '303013',
  'name': '对象删除',
  'code': 'objdel',
  'desc': '对象删除',
  'from': '100500',
  
  'define': {
    width: 40,
    height: 40,
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
            let er  = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT) + 2
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({x:x,y:y,r:er,select:1});
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({x:0,y:50,type:0,oppoint:1});
              pvs.push({x:-50,y:0,type:0,oppoint:1});
              pvs.push({x:0,y:-50,type:0,oppoint:1});
              pvs.push({x:50,y:0,type:0,oppoint:1});
            }
        }`,
        //绘制线段、填充区域

        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({x:sample.x,y:sample.y,stroke:1,begin:1,type:1});
            }else if(i == 2){
             pvs.push({x:sample.x,y:sample.y,stroke:1,end:1,type:1});
            }
        }`,
        `(i, sample, pvs, model, ovs){
            if(i == 1){
              pvs.push({x:sample.x,y:sample.y,stroke:1,begin:1,type:1});
            }else if(i == 3){
             pvs.push({x:sample.x,y:sample.y,stroke:1,end:1,type:1});
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
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            }
          ]
        },

      ]
    }
  }
}
