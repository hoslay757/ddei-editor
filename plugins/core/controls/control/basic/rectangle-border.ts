export default {
  'id': '100007',
  'name': '矩形边框',
  'code': 'rect',
  'desc': '带边框的矩形',
  'from': '100002',

  'define': {
    width: 160,
    height: 80,
    //2为极坐标，缺省点为原点
    poly: 2,
    cIndex: 2,
    //采样信息
    sample: {
      //一圈采样次数
      loop: 4,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
            let er  = sample.r * 1.25
            let x = er * sample.cos
            let y = er * sample.sin
            let begin = 0,end = 0,op2close = 0
            switch(i){
              case 0:
                begin = 1
              break;
              case 1:
                pvs[0].y=y
              break;
              case 2:
                pvs[1].x=x
              break;
              case 3:
                op2close = 1
                pvs[2].y=y 
               x = pvs[0].x
               end = 1
              break;
            }
            pvs.push({begin:begin,end:end,x:x,y:y,r:er,select:1,clip:1,oppoint:2,op2close:op2close});
        }`,

        `(i, sample, pvs, model, ovs){
            let er  = sample.r
            let x = sample.x
            let y = sample.y
            let begin = 0,end = 0
            switch(i){
              case 0:
                begin = 1
              break;
              case 1:
                pvs[0].y=y
              break;
              case 2:
                pvs[1].x=x
              break;
              case 3:
                pvs[2].y=y 
               x = pvs[0].x
               end = 1
              break;
            }
            pvs.push({begin:begin,end:end,x:x,y:y,r:er,stroke:1,fill:1,text:1});
        }`,
      ],


    },
    //组合控件
    composes: [
      {
        width: 200,
        height: 100,
        id: '100002',
        cIndex: 1,
      },
    ]
  }
}
