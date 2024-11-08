export default {
  'id': '100075',
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
        `(i, sample, pvs, model, ovs){
            let er = i%2 == 0 ? sample.r : sample.r * 0.58
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({begin:i==0,end:i==11, x: x, y: y, oppoint:1,select:1,clip:1,stroke:1,fill:1 });
        }`,
        `(i, sample, pvs, model, ovs){
          if(i % 2 == 1){
            let er = sample.r * 0.58
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({begin:i==1,end:i==11, x: x, y: y,stroke:1,fill:1 });
          }
        }`,
        `(i, sample, pvs, model, ovs){
          if(i % 2 == 0 && i != 6 && i !=0){
            let er = sample.r * 0.5
            let x = er * sample.cos
            let y = er * sample.sin
            pvs.push({begin:i==2,end:i==10, x: x, y: y,text:1 });
          }
        }`,

      ]
    },
    textArea: [
      { x: -2.5, y: 32.5, z: 1 },
      { x: 102.5, y: 32.5, z: 1 },
      { x: 102.5, y: 142.5, z: 1 },
      { x: -2.5, y: 142.5, z: 1 },
    ],
  }
}
