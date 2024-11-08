export default {
  'id': '100077',
  'name': 'ddei.control.hexstar',
  'code': 'hexstar',
  'desc': '由极坐标系构造的六芒星',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈6次采样
      loop: 12,
      //初始次采样的开始角度
      angle: -90,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选择范围
        `(i, sample, pvs, model, ovs){
            if(i % 3 == 0){
              let er  = (sample.r+5) / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
              let x = er * Math.cos((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
              let y = er * Math.sin((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
              pvs.push({ begin:i==0,end:i==9,x: x, y: y,select:1 });
            }
        }`,
        //第一层圈
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              let er = sample.r+5
              let x = er * sample.cos
              let y = er * sample.sin
              pvs.push({begin:1,end:1, x: x, y: y,r:er,clip:1,stroke:1,fill:1 });
            }
        }`,
        //第二层圈
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({begin:1,end:1, x: sample.x, y: sample.y,r:sample.r,stroke:1,fill:1 });
            }
        }`,
        //六边形外围
        `(i, sample, pvs, model, ovs){
            let er = i%2 == 0 ? sample.r : sample.r * 0.58
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({ begin:i==0,end:i==11,x: x, y: y,oppoint:1,stroke:1,fill:1 });
        }`,
        //内部五边形
        `(i, sample, pvs, model, ovs){
          if(i % 2 == 1){
            let x = sample.x * 0.58
            let y = sample.y * 0.58
            pvs.push({ begin:i==1,end:i==11,x: x, y: y,stroke:1,fill:1 });
          }
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
          if(i % 2 == 0 && i != 6 && i !=0){
            let x = sample.x*0.5
            let y = sample.y*0.5
            pvs.push({ begin:i==2,end:i==10,x: x, y: y,text:1 });
          }
        }`,

      ],
    },
  }
}
