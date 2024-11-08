export default {
  'id': '303004',
  'name': 'ddei.uml.active1',
  'code': 'act',
  'desc': '激活',
  'from': '100008',

  'define': {
    width: 20,
    height: 200,
    ext: {
      sample: {
        rules: [
          //选中区域
          `(i, sample, pvs, model, ovs){
            if(i == 0){
              let bpv = DDeiUtil.pointsToZero([model.bpv], model.cpv, model.rotate)[0]
              let unitH = 20 * (bpv.y ? 100/bpv.y : 1)
              for(let i = -50;i <= 50;i+=unitH){
                pvs.push({x:-50,y:i,oppoint:1});
                pvs.push({x:50,y:i,oppoint:1});
              }
            }
          }`,
        ]
      }
    }
  }
}
