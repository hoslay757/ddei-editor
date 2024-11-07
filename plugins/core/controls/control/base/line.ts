export default {
  'id': '100401',
  'name': 'ddei.control.line',
  'code': 'line',
  'desc': '直线、折线、曲线三种连接线',
  'type': 'DDeiLine',
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
      'name': 'ddei.lineType',
      'desc': '用来快速连线类型，以便于套用相关的样式',
      'controlType': 'radio',
      'dataSource': [{ 'text': 'ddei.property.ds.lineType1', 'value': 1 }, { 'text': 'ddei.property.ds.lineType2', 'value': 2 }, { 'text': 'ddei.property.ds.lineType3', 'value': 3 }],
      'dataType': 'integer',
      'defaultValue': 1,
      'cascadeDisplay': { 2: { show: ['round'], hidden: [] }, default: { show: [], hidden: ['round'] }, notempty: { hidden: ['round'] } },
      'mapping': [],
      'type': 1
    },
    {
      'code': 'weight',
      'name': 'ddei.property.weight',
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
      'name': 'ddei.property.color',
      'desc': '线段的边框显示颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': '',
    },
    {
      'code': 'fill.weight',
      'name': 'ddei.fill',
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
      'name': 'ddei.property.color',
      'desc': '线段的边框显示颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': 'black',
    },

    {
      'code': 'dash',
      'name': 'ddei.property.dash',
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
      'name': 'ddei.property.opacity',
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
      'name': 'ddei.property.startPointType',
      'desc': '起点的样式样式',
      'controlType': 'combox',
      'dataSource': [
        { 'text': 'ddei.property.ds.none', 'value': -1 },
        { 'text': 'ddei.property.ds.pointType1', 'value': 1 },
        { 'text': 'ddei.property.ds.pointType2', 'value': 2 },
        { 'text': 'ddei.property.ds.pointType21', 'value': 21 },
        { 'text': 'ddei.property.ds.pointType3', 'value': 3 },
        { 'text': 'ddei.property.ds.pointType31', 'value': 31 },
        { 'text': 'ddei.property.ds.pointType4', 'value': 4 },
        { 'text': 'ddei.property.ds.pointType41', 'value': 41 },
        { 'text': 'ddei.property.ds.pointType5', 'value': 5 },
        { 'text': 'ddei.property.ds.pointType51', 'value': 51 },
        { 'text': 'ddei.property.ds.pointType6', 'value': 6 },
        { 'text': 'ddei.property.ds.pointType61', 'value': 61 },

      ],
      'itemStyle': { width: 80, height: 25, col: 2, row: 6 },
      'dataType': 'integer',
      'cascadeDisplay': { "-1": { hidden: ['startWeidht'] }, empty: { hidden: ['startWeidht'] }, notempty: { show: ['startWeidht'] } },
      'defaultValue': -1,
    },
    {
      'code': 'sp.weight',
      'name': 'ddei.property.weight',
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
      'name': 'ddei.property.endPointType',
      'desc': '终点的样式样式',
      'controlType': 'combox',
      'dataSource': [
        { 'text': 'ddei.property.ds.none', 'value': -1 },
        { 'text': 'ddei.property.ds.pointType1', 'value': 1 },
        { 'text': 'ddei.property.ds.pointType2', 'value': 2 },
        { 'text': 'ddei.property.ds.pointType21', 'value': 21 },
        { 'text': 'ddei.property.ds.pointType3', 'value': 3 },
        { 'text': 'ddei.property.ds.pointType31', 'value': 31 },
        { 'text': 'ddei.property.ds.pointType4', 'value': 4 },
        { 'text': 'ddei.property.ds.pointType41', 'value': 41 },
        { 'text': 'ddei.property.ds.pointType5', 'value': 5 },
        { 'text': 'ddei.property.ds.pointType51', 'value': 51 },
        { 'text': 'ddei.property.ds.pointType6', 'value': 6 },
        { 'text': 'ddei.property.ds.pointType61', 'value': 61 },
      ],
      'itemStyle': { width: 80, height: 25, col: 2, row: 6 },
      'dataType': 'integer',
      'cascadeDisplay': { "-1": { hidden: ['endWeidht'] }, empty: { hidden: ['endWeidht'] }, notempty: { show: ['endWeidht'] } },
      'defaultValue': 5,
    },
    {
      'code': 'ep.weight',
      'name': 'ddei.property.weight',
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
      'name': 'ddei.property.round',
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
      'name': 'ddei.jumpline',
      'desc': '用来控制当前线段的跳线类型',
      'controlType': 'radio',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': 1 }, { 'text': 'ddei.property.ds.no', 'value': 2 }, { 'text': 'ddei.property.ds.global', 'value': 0 }],
      'dataType': 'integer',
      'defaultValue': 0,
      'type': 1,
    },
    {
      'code': 'id',
      'name': 'ddei.property.id',
      'desc': '控件在画布的全局唯一ID',
      'controlType': 'text',
      'dataType': 'string',
      'readonly': true,
    },
    {
      'code': 'code',
      'name': 'ddei.property.code',
      'desc': '控件在业务上的唯一编码，缺省和控件ID一致',
      'controlType': 'text',
      'dataType': 'string',
      'defaultValue': 'ddei.property.code001',
    },
  ],
  /**
   * 定义分组，用于属性编辑
   */
  groups: [
    {
      name: "ddei.style",
      icon: 'icon-fill',
      subGroups: [

        {
          name: "ddei.line",
          attrs: ["type", "weight", "color", "fill.weight", "fill.color", "dash", "opacity",
            "sp.type", "sp.weight", "ep.type", "ep.weight", "round", "jumpline"
          ]
        },
      ]
    },
    {
      name: "ddei.propertyName",
      icon: 'icon-edit-properies',
      subGroups: [
        {
          name: "ddei.propertyName",
          attrs: ["code"]
        },

      ]
    },


  ],

  icon: `<svg class="icon" style="width:28px;height:28px;" aria-hidden="true">
        <use xlink:href="#icon-link-line"></use>
      </svg>`,
  filters:{
    LINE_OBI_FILTER: (model, params)=>{
      return false
    }
  }
}