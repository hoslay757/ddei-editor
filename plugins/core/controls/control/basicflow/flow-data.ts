export default {
  'id': '102030',
  'name': '数据',
  'code': 'fdata',
  'desc': '流程的数据节点',
  'from': '100500',

  'define': {
    width: 150,
    height: 90,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈采样次数
      loop: 4,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 45,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i,sample, pvs, model){
            let ds = i == 2 || i ==3 ? 5: -5
            let x = sample.x+ds
            let y = sample.y
            let op2close = i == 3 ? 1 :0
            pvs.push({begin:i==0,end:i==3, x: x, y: y,select:1,clip:1,fill:1,stroke:1,oppoint:2,op2close:op2close });
        }`,
        `(i,sample, pvs, model){
            let ds = i == 1 || i ==2 ? 5: -5
            let x = sample.x+ds
            let y = sample.y
            pvs.push({ begin:i==0,end:i==3, x: x, y: y,text:1 });
        }`,
      ]
    }
  }
}
