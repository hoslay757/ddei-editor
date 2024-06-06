import { ov_link_v_split_point, ov_link_h_split_point } from "ddei-framework";

export default {
  'id': '305003',
  'name': '包',
  'code': 'pkg',
  'desc': '包',
  'from': '100500',
  'icon': 'toolbox-shape-square',
  'define': {
    width: 200,
    height: 160,
    //2为极坐标，以cpv为圆心，半径r采样获得点，在以width/100、height/100的的原始比例进行缩放
    poly: 2,
    //采样信息
    sample: {
      eqrat: false,
      //只采样一次
      loop: 1,
      //初始次采样的开始角度
      angle: 0,
      //半径距离
      r: 50,
      //采样的规则，多组采样返回多组规则
      rules: [
        //选中区域
        `(i, sample, pvs, model,ovs){
            pvs.push({begin:1,x:50,y:50,stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:-50,y:50,stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:-50,y:(ovs[0].y-model.cpv.y),stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:-50,y:-50,stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:(ovs[1].x-ovs[1].ovi.x-50),y:-50,stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:(ovs[1].x-ovs[1].ovi.x-50),y:(ovs[0].y-model.cpv.y),stroke:1,fill:1,clip:1,oppoint:2,select:1});
            pvs.push({x:50,y:(ovs[0].y-model.cpv.y),stroke:1,fill:1,clip:1,oppoint:2,op2close:1,select:1,end:1});
        }`,
        `(i, sample, pvs, model,ovs){
            pvs.push({x:-50,y:(ovs[0].y-model.cpv.y),stroke:1,type:1});
            pvs.push({x:50,y:(ovs[0].y-model.cpv.y),stroke:1,type:1});
            
        }`,
      ],


    },
    // 组合控件
    composes: [
      {
        width: 80,
        height: 20,
        id: '100002',
        cIndex: 2,
        text: "Package",
        fill: { type: 0 },
        border: { type: 0 },
        textStyle: {
          feed: 1,
          scale: 1,
        },
        initCPV: {
          x: -60, y: -70
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
      {
        width: 200,
        height: 140,
        id: '100002',
        cIndex: 2,
        fill: { type: 0 },
        border: { type: 0 },
        text: "Attribute",
        textStyle: {
          feed: 1,
          scale: 1,
        },
        initCPV: {
          x: 0, y: 10
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
    ],
    //操作点定义
    ovs: [
      //定义垂直控制点
      {
        x: -30, y: -37.5, ix: -30, iy: -50,
        type: 1, //纵向分割点
        constraint: {
          type: 2,
          x0: -30,
          x1: -30,
          y0: -50,
          y1: -20
        },
        //联动，控制composes的大小
        //这里计算较为复杂，需要用脚本来进行控制
        links: [
          {
            type: 99,//执行脚本
            script: ov_link_v_split_point,
            //参数可以自定义，脚本中可以取到
            models: ["composes[0]"],
            nextModels: ["composes[1]"]
          }
        ]
      },
      //上方标题的区域宽度控制点
      {
        x: -10, y: -43.75, ix: -50, iy: -43.75,
        type: 2, //横向分割点
        constraint: {
          type: 2,
          x0: -50,
          x1: 50,
          y0: -43.75,
          y1: -43.75
        },
        //联动，控制第一个和第二个composes的大小
        //这里计算较为复杂，需要用脚本来进行控制
        links: [
          {
            type: 99,//执行脚本
            script: ov_link_h_split_point,
            //参数可以自定义，脚本中可以取到
            models: ["composes[0]"],
            nextModels: []
          }
        ]
      }
    ],
    ext: {
      groups: [
        {
          name: "样式",
          icon: 'icon-a-ziyuan375',
          subGroups: [
            {
              name: "填充",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            },
            {
              name: "线条",
              attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
            },
            {
              name: "文本",
              attrs: ["font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
                , "textStyle.scale", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
                , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]
            },
          ]
        },

      ]
    }
  }

}

