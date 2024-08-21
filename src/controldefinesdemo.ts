import HtmlViewerDemo from "./HtmlViewerDemo.vue";
//控件定义
const controls: object[] = [
  {
    'id': '9999001',
    'name': '自定义1',
    'code': 'cust_1',
    'desc': '自定义节点1',
    'from': '302006',
    'define': {
      fill: {
        color: "#e1b348"
      }
    }
  },
  //复写已有的配置
  {
    'id': '102010',
    'define': {
      fill: {
        color: "#e1b348"
      },
      width:150,
      height:100
    }
  },
  {
    'id': '9999002',
    'name': '自定义2',
    'code': 'cust_2',
    'desc': '自定义节点2',
    'from': '302006',
    'define': {
      fill: {
        color: "#ffc0be"
      },
      ext: {
        attrs: [
          {
            'code': 'text1',
            'name': '文本1',
            'desc': '控件的主体显示文本',
            'controlType': 'excheckbox',
            'dataType': 'integer',
            'dataSource': [{ 'text': '文本', 'value': 0 }, { 'text': '数字', 'value': 1 }, { 'text': '金额', 'value': 2 }, { 'text': '时间', 'value': 3 }],
            'itemStyle': { width: 80, height: 25, col: 2, row: 0, imgWidth: 20, imgHeight: 20 },
            'isArray': true,
            'defaultValue': [1, 2],
            'type': [1, 2], //类别，1图形，2业务，3事件
            'readonly': true,
          },
          {
            'code': 'bpmnSubType',
            'name': '类型',
            'desc': '控件的主体显示文本',
            'controlType': 'combox',
            'dataType': 'integer',
            'dataSource': [
              { 'text': '默认', 'value': 1 }, { 'text': '中断-消息', 'value': 2 }, { 'text': '非中断-消息', 'value': 3 },
              { 'text': '中断-定时器', 'value': 4 }, { 'text': '非中断-定时器', 'value': 5 }, { 'text': '中断-条件', 'value': 6 },
              { 'text': '非中断-条件', 'value': 7 }, { 'text': '中断-信号', 'value': 8 }, { 'text': '非中断-信号', 'value': 9 },
              { 'text': '中断-多次', 'value': 10 }, { 'text': '非中断-多次', 'value': 11 }, { 'text': '中断-并行', 'value': 12 },
              { 'text': '非中断-并行', 'value': 13 }, { 'text': '中断-升级', 'value': 14 }, { 'text': '非中断-升级', 'value': 15 },
              { 'text': '中断-错误', 'value': 16 }, { 'text': '中断-补偿', 'value': 17 }
            ],
            'itemStyle': { width: 100, height: 25, col: 2, row: 0 },
            'defaultValue': 1,
            'type': [1, 2], //类别，1图形，2业务，3事件
          },
        ],
        groups: [
          {
            name: "数据",
            icon: 'icon-a-ziyuan409',
            subGroups: [
              {
                name: "分组1",
                attrs: ["code", "text1","bpmnSubType"]
              },
              {
                name: "分组2",
                attrs: ["text"]
              },

            ]
          },
        ]
      }
    },
    viewer: HtmlViewerDemo

  }
]

//分组定义
const groups: object[] = [
  {
    id: '999',
    name: '自定义扩展',
    code: 'custom-group',
    desc: '自定义扩展分组',
    subject: 'custom',
    orderNo: 0,
    controls: [
      {
        'id': '302002',
        'name': '扩展用例',
      },
      {
        'id': '9999001',
        'name': '自定义1'
      },
      {
        'id': '9999002',
        'name': '自定义2'
      },
      {
        'id': '302007',
        'name': '扩展用例',
      }
    ]
  }
]

export { controls,groups}
