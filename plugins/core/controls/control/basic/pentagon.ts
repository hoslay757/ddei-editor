export default {
  'id': '100020',
  'name': '五边形',
  'code': 'pentagon',
  'desc': '由五个点构成的五边形',
  'from': '100500',

  'define': {
    width: 154,
    height: 154,
    poly: 2,
    //采样信息
    sample: {
      eqrat: true,
      //一圈5次采样
      loop: 5,
      //初始次采样的开始角度
      angle: 198,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let start = 0,end = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 4:
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,select:1,clip:1,oppoint:2,op2close:i == 4?1:0,stroke:1,fill:1});
        }`,
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              pvs.push({begin:1,x:28,y:35,text:1});
              pvs.push({x:-28,y:35,text:1});
              pvs.push({x:-28,y:-28,text:1});
              pvs.push({end:1,x:28,y:-28,text:1});
            }
        }`,

      ]
    }
  }
}
