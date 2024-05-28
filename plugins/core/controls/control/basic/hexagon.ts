export default {
  'id': '100030',
  'name': '六边形',
  'code': 'hexagon',
  'desc': '由六个点构成的六边形',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      //一圈4次采样
      loop: 6,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
          let x = er * sample.cos
          let y = er * sample.sin
          pvs.push({begin:i == 0,end:i == 5,op2close:i == 5 ? 1 :0,oppoint:2,x:x,y:y,select:1,clip:1,stroke:1,fill:1});
        }`,

        `(i, sample, pvs, model, ovs){
          
          switch(i){
            case 0:;
            case 2:;
            case 3:;
            case 5:
              let er = sample.r / Math.cos(30 * DDeiConfig.ROTATE_UNIT)
              let rad = (sample.sita+30) * DDeiConfig.ROTATE_UNIT
              let x = er * Math.cos(rad)
              let y = er * Math.sin(rad)
              pvs.push({begin:i == 0,end:i == 5,x:x,y:y,text:1});
            ;
          }
        }`,



      ]
    }
  }
}
