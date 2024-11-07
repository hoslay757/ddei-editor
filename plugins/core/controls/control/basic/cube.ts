export default {
  'id': '100501',
  'name': 'ddei.control.cube',
  'code': 'cube',
  'desc': '正方体',
  'from': '100500',
  
  'define': {
    width: 100,
    height: 100,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      eqrat: true,
      //只采样一次
      loop: 1,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //允许文本输入
      textInput: 1,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
            pvs.push({begin:1,x:50,y:50,stroke:1,select:1,oppoint:2,fill:1});
            pvs.push({x:-50,y:50,stroke:1,select:1,oppoint:2,fill:1});
            pvs.push({x:-50,y:-50,stroke:1,select:1,oppoint:2,fill:1});
            pvs.push({x:-45,y:-60,stroke:1,select:1,oppoint:1,fill:1});
            pvs.push({x:55,y:-60,stroke:1,select:1,oppoint:1,fill:1});
            pvs.push({end:1,x:55,y:40,stroke:1,select:1,oppoint:1,fill:1});
        }`,
        //内部连线
        `(i, sample, pvs, model, ovs){
             pvs.push({begin:1,x:-50,y:-50,stroke:1});
             pvs.push({x:50,y:-50,stroke:1,oppoint:2,op2close:1});
             pvs.push({x:55,y:-60,stroke:1});
             pvs.push({x:-50,y:-50,type:3});
             pvs.push({x:50,y:-50,stroke:1});
             pvs.push({x:50,y:50,stroke:1});
             pvs.push({x:-50,y:-50,type:3});
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
             pvs.push({x:-48,y:48,text:sample.textInput});
             pvs.push({x:-48,y:-48,text:sample.textInput});
             pvs.push({x:48,y:-48,text:sample.textInput});
             pvs.push({x:48,y:48,text:sample.textInput});
        }`,


      ]
    }
  }

}
