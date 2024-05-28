export default {
  'id': '100040',
  'name': '菱形',
  'code': 'diamond',
  'desc': '标准的菱形',
  'from': '100500',

  'define': {
    width: 160,
    height: 80,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: -90,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
            pvs.push({begin:i==0,end:i==3,x:sample.x,y:sample.y,select:1,oppoint:1,stroke:1,fill:1,clip:1});
        }`,
        `(i, sample, pvs, model, ovs){
            let er = sample.r * Math.cos(45)
            let x = er * Math.cos((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            let y = er * Math.sin((sample.sita+45) * DDeiConfig.ROTATE_UNIT)
            pvs.push({begin:i==0,end:i==3,x:x,y:y,text:1});
        }`,
      ]
    }
  }
}

