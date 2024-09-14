export default {
  'id': '100401',
  'name': '连接线',
  'code': 'line',
  'desc': '直线、折线、曲线三种连接线',
  'type': 'DDeiLine',
  'icon': 'icon-line-fold',
  /**
   * 定义组件属性
   * 样式属性会影响图形的显示，修改样式属性也会刷新图形
   * 数据属性一般用于业务计算，数据属性一般不会刷新图形，除非数据属性和样式属性产生联动关系
   * 事件属性一般用来作为扩展用
   * 属性采用三层结构：组---子分组---属性，在基础json中先定义而后使用（可以复写）
   * 特殊属性：
   *    code属性编码在统一个组中，code唯一
   *    mapping建立与模型中属性的映射关系，为null时为默认，采用code指向的属性映射；mapping为[]时交由控件编辑器处理值映射
   *    hiddenTitle隐藏标题，为true时不会显示属性标题，默认false不隐藏标题
   *    display控件显示模式，有row（横向排列）和column（纵向排列）两个选项，默认row
   */
  attrs: [
    {
      'code': 'type',
      'name': '类型',
      'desc': '用来快速连线类型，以便于套用相关的样式',
      'controlType': 'radio',
      'dataSource': [{ 'text': '直线', 'value': 1 }, { 'text': '折线', 'value': 2 }, { 'text': '曲线', 'value': 3 }],
      'dataType': 'integer',
      'defaultValue': 1,
      'cascadeDisplay': { 2: { show: ['round'], hidden: [] }, default: { show: [], hidden: ['round'] }, notempty: { hidden: ['round'] } },
      'mapping': [],
      'type': 1
    },
    {
      'code': 'weight',
      'name': '线段',
      'desc': '控件的宽度',
      'controlType': 'range',
      'min': 0.1,
      'max': 10,
      'step': 0.1,
      'dataType': 'float',
      'defaultValue': 1,
    },
    {
      'code': 'color',
      'name': '颜色',
      'desc': '线段的边框显示颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': '',
    },
    {
      'code': 'fill.weight',
      'name': '填充',
      'desc': '填充的大小',
      'controlType': 'range',
      'min': 0,
      'max': 30,
      'step': 1,
      'defaultValue': 0,
      'dataType': 'integer',
    },
    {
      'code': 'fill.color',
      'name': '填充色',
      'desc': '线段的边框显示颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': 'black',
    },

    {
      'code': 'dash',
      'name': '虚线',
      'desc': '图形的边框的是否为虚线样式，虚线由长短不一的线段构成',
      'controlType': 'border-dash',
      'dataSource': [
        { 'text': '1', 'value': [] },
        { 'text': '2', 'value': [10, 5] },
        { 'text': '3', 'value': [5, 5] },
        { 'text': '4', 'value': [10, 4, 2, 4] },
        { 'text': '5', 'value': [10, 4, 2, 4, 2, 4] },
        { 'text': '6', 'value': [10, 4, 10, 4, 2, 4] },
        { 'text': '7', 'value': [20, 5, 10, 5] },
        { 'text': '8', 'value': [20, 5, 10, 5, 10, 5] },
        { 'text': '9', 'value': [3, 3] },
        { 'text': '10', 'value': [2, 2] },
        { 'text': '11', 'value': [3, 2, 2, 2] },
        { 'text': '13', 'value': [20, 10] },
      ],
      'dataType': 'integer',
      'defaultValue': [],
      'isArray': true,
    },
    {
      'code': 'opacity',
      'name': '透明度',
      'desc': '图形的边框的透明度，0完全透明~1完全不透明',
      'controlType': 'range',
      'min': 0,
      'max': 1,
      'step': 0.01,
      'dataType': 'float',
      'defaultValue': 1,
      'display': 'column',
    },


    {
      'code': 'sp.type',
      'name': '起点类型',
      'desc': '起点的样式样式',
      'controlType': 'combox',
      'dataSource': [
        { 'text': '无', 'value': -1 },
        { 'text': '箭头', 'value': 1 },
        { 'text': '圆形', 'value': 2 },
        { 'text': '圆形-实心', 'value': 21 },
        { 'text': '方形', 'value': 3 },
        { 'text': '方形-实心', 'value': 31 },
        { 'text': '菱形', 'value': 4 },
        { 'text': '菱形-实心', 'value': 41 },
        { 'text': '三角形', 'value': 5 },
        { 'text': '三角形-实心', 'value': 51 },
        { 'text': '半圆', 'value': 6 },
        { 'text': '半圆-实心', 'value': 61 },

      ],
      'itemStyle': { width: 80, height: 25, col: 2, row: 6 },
      'dataType': 'integer',
      'cascadeDisplay': { "-1": { hidden: ['startWeidht'] }, empty: { hidden: ['startWeidht'] }, notempty: { show: ['startWeidht'] } },
      'defaultValue': -1,
    },
    {
      'code': 'sp.weight',
      'name': '大小',
      'desc': '起点的箭头的宽度',
      'controlType': 'range',
      'min': 1,
      'max': 30,
      'step': 1,
      'defaultValue': 6,
      'dataType': 'integer',
    },
    {
      'code': 'ep.type',
      'name': '终点类型',
      'desc': '终点的样式样式',
      'controlType': 'combox',
      'dataSource': [
        { 'text': '无', 'value': -1 },
        { 'text': '箭头', 'value': 1 },
        { 'text': '圆形', 'value': 2 },
        { 'text': '圆形-实心', 'value': 21 },
        { 'text': '方形', 'value': 3 },
        { 'text': '方形-实心', 'value': 31 },
        { 'text': '菱形', 'value': 4 },
        { 'text': '菱形-实心', 'value': 41 },
        { 'text': '三角形', 'value': 5 },
        { 'text': '三角形-实心', 'value': 51 },
        { 'text': '半圆', 'value': 6 },
        { 'text': '半圆-实心', 'value': 61 },
      ],
      'itemStyle': { width: 80, height: 25, col: 2, row: 6 },
      'dataType': 'integer',
      'cascadeDisplay': { "-1": { hidden: ['endWeidht'] }, empty: { hidden: ['endWeidht'] }, notempty: { show: ['endWeidht'] } },
      'defaultValue': 5,
    },
    {
      'code': 'ep.weight',
      'name': '大小',
      'desc': '终点的箭头的宽度',
      'controlType': 'range',
      'min': 1,
      'max': 30,
      'step': 1,
      'defaultValue': 6,
      'dataType': 'integer',
    },

    {
      'code': 'round',
      'name': '圆角',
      'desc': '图形的边框的是否为为圆角的弧度',
      'controlType': 'range',
      'min': 0,
      'max': 30,
      'step': 1,
      'defaultValue': 0,
      'dataType': 'integer',
    },
    {
      'code': 'jumpline',
      'name': '跳线',
      'desc': '用来控制当前线段的跳线类型',
      'controlType': 'radio',
      'dataSource': [{ 'text': '是', 'value': 1 }, { 'text': '否', 'value': 2 }, { 'text': '全局', 'value': 0 }],
      'dataType': 'integer',
      'defaultValue': 0,
      'type': 1,
    },
    {
      'code': 'id',
      'name': 'id',
      'desc': '控件在画布的全局唯一ID',
      'controlType': 'text',
      'dataType': 'string',
      'readonly': true,
    },
    {
      'code': 'code',
      'name': '编码',
      'desc': '控件在业务上的唯一编码，缺省和控件ID一致',
      'controlType': 'text',
      'dataType': 'string',
      'defaultValue': '编码001',
    },
  ],
  /**
   * 定义分组，用于属性编辑
   */
  groups: [
    {
      name: "样式",
      icon: 'icon-a-ziyuan375',
      subGroups: [

        {
          name: "线条",
          attrs: ["type", "weight", "color", "fill.weight", "fill.color", "dash", "opacity",
            "sp.type", "sp.weight", "ep.type", "ep.weight", "round", "jumpline"
          ]
        },
      ]
    },
    {
      name: "属性",
      icon: 'icon-a-ziyuan409',
      subGroups: [
        {
          name: "属性",
          attrs: ["code"]
        },

      ]
    },


  ],

  filters:{
    LINE_OBI_FILTER: (model, params)=>{
      return false
    }
  }
}