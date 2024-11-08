export default {
  'id': '103008',
  'name': 'ddei.control.comment',
  'code': 'comment',
  'desc': '跟随内容变化大小的注释文本',
  'from': '100000',
  'define': {
    borderType: 0,
    border: {
      type: 0,
      selected:{
        type:1,
        dash:[5,5],
        width:1
      }
    },
    fill: {
      type: 0
    },
    text: "ddei.control.comment",
    sample: {
      //一圈4次采样
      loop: 4,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        `(i, sample, pvs, model, ovs){
          let start = 0,end = 0,op2close = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
                pvs[0].y=sample.y
              break;
              case 2:
                pvs[1].x=sample.x
              break;
              case 3:
                op2close = 1
                pvs[2].y=sample.y 
                sample.x = pvs[0].x
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,r:sample.r,select:1,clip:1,op2close:op2close,align:1,stroke:1,fill:1});
        }`,

        `(i, sample, pvs, model, ovs){
          if(i == 0){
            pvs.push({type:0,x:50,y:0,oppoint:1});
            pvs.push({type:0,x:0,y:50,oppoint:1});
            pvs.push({type:0,x:-50,y:0,oppoint:1});
            pvs.push({type:0,x:0,y:-50,oppoint:1});
          }
        }`,


        `(i, sample, pvs, model, ovs){
            if(i == 0){
              if(model.exPvs){
                let left
                for(let n in model.exPvs){
                  let ep = model.exPvs[n]
                  if(ep.sita == 180){
                    left = 1
                    break
                  }
                }
                if(left){
                  pvs.push({begin:1,x:-45,y:-50});
                  pvs.push({x:-50,y:-50,stroke:1,forceStroke:1});
                  pvs.push({x:-50,y:50,stroke:1,forceStroke:1});
                  pvs.push({x:-45,y:50,stroke:1,forceStroke:1});
                  pvs.push({end:1,x:-45,y:-50});
                }
              }
            }
          }`,
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              if(model.exPvs){
                let right
                for(let n in model.exPvs){
                  let ep = model.exPvs[n]
                  if(ep.sita == 0){
                    right = 1
                    break;
                  }
                }
                
                if(right){
                  pvs.push({begin:1,x:45,y:-50});
                  pvs.push({x:50,y:-50,stroke:1,forceStroke:1});
                  pvs.push({x:50,y:50,stroke:1,forceStroke:1});
                  pvs.push({x:45,y:50,stroke:1,forceStroke:1});
                  pvs.push({end:1,x:45,y:50});
                }
                
              }
            }
          }`,
          
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              if(model.exPvs){
                let top
                for(let n in model.exPvs){
                  let ep = model.exPvs[n]
                  if(ep.sita == -90){
                    top = 1
                    break;
                  }
                }
                
                if(top){
                  pvs.push({begin:1,x:-50,y:-45});
                  pvs.push({x:-50,y:-50,stroke:1,forceStroke:1});
                  pvs.push({x:50,y:-50,stroke:1,forceStroke:1});
                  pvs.push({x:50,y:-45,stroke:1,forceStroke:1});
                  pvs.push({end:1,x:50,y:-45});
                }
                
              }
            }
          }`,
        `(i, sample, pvs, model, ovs){
            if(i == 0){
              if(model.exPvs){
                let bottom
                for(let n in model.exPvs){
                  let ep = model.exPvs[n]
                  if(ep.sita == 90){
                    bottom = 1
                    break;
                  }
                }
                
                if(bottom){
                  pvs.push({begin:1,x:-50,y:45});
                  pvs.push({x:-50,y:50,stroke:1,forceStroke:1});
                  pvs.push({x:50,y:50,stroke:1,forceStroke:1});
                  pvs.push({x:50,y:45,stroke:1,forceStroke:1});
                  pvs.push({end:1,x:50,y:45});
                }
              }
            }
          }`,


        //文本区域
        `(i, sample, pvs, model, ovs){
            let start = 0,end = 0
            switch(i){
              case 0:
                start = 1  
              break;
              case 1:
                pvs[0].y=sample.y
              break;
              case 2:
                pvs[1].x=sample.x
              break;
              case 3:
                pvs[2].y=sample.y 
                sample.x = pvs[0].x
                end = 1
              break;
            }
            pvs.push({begin:start,end:end,x:sample.x,y:sample.y,text:1});
          }`,

      ]
    },
    ext: { 
      /**
       * 定义分组，用于属性编辑
       */
      groups: [
        {
          name: "ddei.style",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "文本",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.paddingWeight", "textStyle.lockWidth", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
            {
              name: "ddei.border",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            },
            {
              name: "ddei.fill",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            }

          ]
        },
        {
          name: "ddei.data",
          icon: 'icon-edit-properies',
          subGroups: [
            {
              name: "ddei.basic",
              attrs: ["code", "text", "fmt.type", "fmt.nscale", "fmt.tmark", "fmt.mmark", "fmt.munit", "fmt.mrmb", "fmt.dtype", "fmt.format"]
            },

          ]
        },


      ],
      attrs: [
        {
          'code': 'textStyle.paddingWeight',
      'name': 'ddei.property.paddingWeight',
          'desc': '超范围自动扩展的情况下保留的宽度',
          'controlType': 'text',
          'dataType': 'integer',
          'defaultValue': 10,
          'hiddenTitle': true,
          'display': 'column',
          'type': [1, 2]
        },
        {
          'code': 'textStyle.scale',
          'name': 'ddei.property.outSize',
      'desc': '文本的超出范围后的策略',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.hidden', 'value': '0' }, { 'text': 'ddei.property.ds.ellipsis', 'value': '2' }, { 'text': 'ddei.property.ds.narrow', 'value': '1' }, { 'text': 'ddei.property.ds.ext', 'value': '3' }],
          'defaultValue': 3,
          'cascadeDisplay': { 3: { show: ['textStyle.lockWidth', "textStyle.paddingWeight"], hidden: [] }, default: { show: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, empty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] }, notempty: { hidden: ['textStyle.lockWidth', "textStyle.paddingWeight"] } }
        }
      ]
    }
  },

}
