export default {
  'id': '102040',
  'name': 'ddei.control.subflow',
  'code': 'subflow',
  'desc': '流程的子流程节点',
  'from': '100500',

  'define': {
    width: 160,
    height: 100,
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

        `(i, sample, pvs, model, ovs){
            pvs.push({ begin:i==0,end:i==3,x: sample.x, y: sample.y,select:1,clip:1,stroke:1,fill:1 });
        }`,

        `(i, sample, pvs, model, ovs){
            let er  = sample.r
            let x = sample.x
            let y = sample.y
            pvs.push({x:x,y:y,r:er,type:0,oppoint:2,op2close:i == 3 ? 1: 0});
           
        }`,
        `(i, sample, pvs, model, ovs){
            let ds = i == 1 || i ==2 ? 10: -10
            let x = sample.x+ds
            let y = sample.y
            pvs.push({ begin:i==0,end:i==3,x: x, y: y,text:1,stroke:1 });
        }`,
      ]
    }
  }
}
