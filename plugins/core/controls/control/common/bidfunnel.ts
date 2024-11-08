export default {
  'id': '103007',
  'name': 'ddei.control.bindfunnel',
  'code': 'bidfunnel',
  'desc': '双向漏斗',
  'from': '100500',

  'define': {
    width: 100,
    height: 100,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈采样次数
      loop: 6,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
          if(i !=0 && i != 3){
            let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({begin:i == 1,end:i == 5,x:x,y:y,select:1,clip:1});
          }
        }`,
        //主体图形
        `(i, sample, pvs, model, ovs){
          let er = sample.r / Math.cos(45 * DDeiConfig.ROTATE_UNIT)
          let x = er * sample.cos
          let y = er * sample.sin
          switch(i){
            case 1:
              pvs.push({begin:1,x:x,y:y,oppoint:2,clip:1,stroke:1,fill:1});
            break;
            case 2:
              pvs.push({x:x,y:y,oppoint:2,clip:1,stroke:1,fill:1});
              pvs.push({x:0,y:0,oppoint:1,clip:1,stroke:1,fill:1});
            break;
            case 4:
              pvs.push({end:1,x:x,y:y,oppoint:2,op2close:1,clip:1,stroke:1,fill:1});
            break;
            case 5:
              pvs.splice(3,0,{x:x,y:y,oppoint:2,clip:1,stroke:1,fill:1})
            break;
          }
        }`
      ]
    }
  }
}
