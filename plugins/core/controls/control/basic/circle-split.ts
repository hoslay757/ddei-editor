export default {
  'id': '100104',
  'name': '圆形-切割',
  'code': 'circle',
  'desc': '由圆形，从中间横向/纵向切割开',
  'from': '100103',
  'icon': 'toolbox-shape-circle',
  'define': {
    //扩展采样信息，用于在原有的基础上增加采样，或者覆盖采样的部分信息
    ext: {
      //追加一个从中间切开的采样点，用于横向切割
      sample: {
        direct: 1,//1横向切割，2纵向切割
        pvalue: 0,//切割的坐标，横向切割时为纵坐标，纵向切割时为横坐标
        rules: [
          `(i, sample, pvs, model, ovs){
            if(i == 0){
              if(sample.direct == 1){
                pvs.push({begin:1,x:-50,y:sample.pvalue,stroke:1,type:1});
                pvs.push({end:1,x:50,y:sample.pvalue,stroke:1,type:1});
              }else{
                pvs.push({begin:1,x:sample.pvalue,y:-50,stroke:1,type:1});
                pvs.push({end:1,x:sample.pvalue,y:50,stroke:1,type:1});
              }
            }
          }`
        ]
      }
    }

  }

}
