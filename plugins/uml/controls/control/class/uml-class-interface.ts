import { ov_link_v_split_point, ov_link_h_split_point } from "ddei-framework";
export default {
  'id': '307004',
  'name': '接口',
  'code': 'inte',
  'desc': 'UML的接口节点',
  'from': '100008',

  'define': {
    width: 230,
    height: 100,
    border: {
      round: 5
    },
    //扩展采样信息，用于在原有的基础上增加采样，或者覆盖采样的部分信息
    ext: {
      //追加一个从中间切开的采样点，用于横向切割
      sample: {
        rules: [
          `(i, sample, pvs, model,ovs){
            if(i == 0){
              pvs.push({x:-50,y:(ovs[0].y-model.cpv.y),stroke:1,type:1});
              pvs.push({x:50,y:(ovs[0].y-model.cpv.y),stroke:1,type:1});
            }
          }`
        ]
      },
      groups: [
        {
          name: "ddei.style",
          icon: 'icon-fill',
          subGroups: [
            {
              name: "ddei.fill",
              attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
            },
            {
              name: "ddei.line",
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
    },
    //组合控件
    composes: [
      {
        width: 230,
        height: 30,
        id: '100002',
        cIndex: 1,
        text: `<<interface>>
接口名`,
        textStyle: {
          bold: 1,
          feed: 1,
          scale: 1
        },
        fill: {
          type: 0
        },
        border: {
          type: 0
        },
        initCPV: {
          x: 0, y: -35
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },
      {
        width: 230,
        height: 70,
        id: '100002',
        cIndex: 1,
        text: ` + Operation A(int): void
 + Operation B(): void
 - Operation C(int): int`,
        textStyle: {
          align: 1,
          feed: 1,
          scale: 1,
          vspace: 2,
        },
        fill: {
          type: 0
        },
        border: {
          type: 0
        },
        initCPV: {
          x: 0, y: 15
        },
        attrLinks: [
          { code: "font", mapping: ["*"] },
          { code: "textStyle", mapping: ["*"] },
        ]
      },

    ],
    //操作点定义
    ovs: [
      //定义标题区域的高度控制点
      {
        x: 0, y: -20, ix: 0, iy: -50,
        type: 1, //纵向分割点
        constraint: {
          type: 2,
          x0: 0,
          x1: 0,
          y0: -50,
          y1: -20
        },
        //联动，控制第一个和第二个composes[0]的大小
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

    ]
  }

}
