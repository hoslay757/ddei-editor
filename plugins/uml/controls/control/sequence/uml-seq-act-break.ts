export default {
  'id': '303005',
  'name': '激活中断',
  'code': 'actbreak',
  'desc': '激活中断',
  'from': '100500',
  
  'define': {
    width: 20,
    height: 200,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      //一圈4次采样
      loop: 1,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选择区
        `(i, sample, pvs, model, ovs){
          pvs.push({begin:1,x:50,y:50,clip:1,select:1});
          pvs.push({x:-50,y:50,clip:1,select:1});
          pvs.push({x:-50,y:-50,clip:1,select:1});
          pvs.push({end:1,x:50,y:-50,clip:1,select:1});
        }`,
        //下半部分区域
        `(i, sample, pvs, model, ovs){
          let bpv = DDeiUtil.pointsToZero([model.bpv], model.cpv, model.rotate)[0]
          let unitH = 15 * (bpv.y ? 100 / bpv.y : 1)
          pvs.push({begin:1,x:50,y:50,stroke:1,fill:1});
          pvs.push({x:-50,y:50,stroke:1,fill:1});
          pvs.push({x:-50,y:unitH,stroke:1,fill:1});
          pvs.push({end:1,x:50,y:0.5*unitH,stroke:1,fill:1});
        }`,
        //上办部分区域
        `(i, sample, pvs, model, ovs){
          let bpv = DDeiUtil.pointsToZero([model.bpv], model.cpv, model.rotate)[0]
          let unitH = 15 * (bpv.y ? 100 / bpv.y : 1)
          pvs.push({begin:1,x:-50,y:-50,stroke:1,fill:1});
          pvs.push({x:50,y:-50,stroke:1,fill:1});
          pvs.push({x:50,y:-0.5*unitH,stroke:1,fill:1});
          pvs.push({end:1,x:-50,y:-unitH,stroke:1,fill:1});
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
          let bpv = DDeiUtil.pointsToZero([model.bpv], model.cpv, model.rotate)[0]
          let unitH = 20 * (bpv.y ? 100 / bpv.y : 1)
          for(let i = -50; i <= 50; i+=unitH){
            pvs.push({ x: -50, y: i, type: 0, oppoint: 1 });
            pvs.push({ x: 50, y: i, type: 0, oppoint: 1 });
          }
        }`
      ]
    }
  }
}
