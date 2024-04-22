export default {
  'id': '102032',
  'name': '存储数据',
  'code': 'fdata',
  'desc': '流程的数据节点',
  'from': '102030',

  'define': {
    width: 100,
    height: 70,
    //2为极坐标，缺省点为原点
    poly: 2,
    //采样信息
    sample: {
      //一圈采样次数
      loop: 1,
      //半径距离
      r: 50,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model, ovs){
            let dr  = -50/ Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            pvs.push({begin:1,x:-dr,y:50,select:1})
            pvs.push({x:dr,y:50,select:1})
            pvs.push({x:dr,y:-50,select:1})
            pvs.push({end:1,x:-dr,y:-50,select:1})
        }`,
        //操作点
        `(i, sample, pvs, model, ovs){
            let dr  = 50/ Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            pvs.push({x:100-dr,y:0,oppoint:1})
            pvs.push({x:-dr,y:0,oppoint:1})
            pvs.push({x:0,y:50,oppoint:1})
            pvs.push({x:0,y:-50,oppoint:1})
        }`,
        //主体区域
        `(i, sample, pvs, model, ovs){
            let dr  = 50/ Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            let rad1 = 135 * DDeiConfig.ROTATE_UNIT
            let rad2 = 225 * DDeiConfig.ROTATE_UNIT
            pvs.push({begin:1,x:50,y:50,stroke:1,fill:1,clip:1})
            pvs.push({x:-50,y:50,r:dr,rad:rad1,stroke:1,fill:1,clip:1})
            pvs.push({x:-50,y:-50,type:2,r:dr,rad:rad2,direct:1,stroke:1,fill:1,clip:1})
            pvs.push({x:50,y:-50,r:dr,rad:rad2,stroke:1,fill:1,clip:1})
            pvs.push({end:1,dx:100,type:2,r:dr,rad:rad1,direct:0,stroke:1,fill:1,clip:1})
        }`,
        //文本区域
        `(i, sample, pvs, model, ovs){
            let dr  = 50/ Math.cos(45 * DDeiConfig.ROTATE_UNIT)
            pvs.push({begin:1,x:100-dr,y:50,text:1})
            pvs.push({x:-50,y:50,text:1})
            pvs.push({x:-50,y:-50,text:1})
            pvs.push({end:1,x:100-dr,y:-50,text:1})
        }`,
      ],

    }, iconPos: {
      dw: 15
    }
  }
}
