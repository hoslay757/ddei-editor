export default {
  'id': 'DDeiStage',
  'name': 'ddei.control.stage',
  'code': 'stage',
  'desc': '整体画布的属性',
  'type': 'DDeiStage',
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
      'code': 'paper.type',
      'name': 'ddei.property.paperType',
      'desc': '用来快速选择纸张的类型，以便于套用相关的样式',
      'controlType': 'combox',
      'dataType': 'string',
      'dataSource': {
        'type': 'config',
        'data': 'PAPER_DATASOURCE',
        'text': 'name',
        'value': 'code',
        'desc': 'desc'
      },
      'canSearch': false,
      'itemStyle': { width: 170, align: 'left', paddingLeft: '10px', height: 25, col: 1, row: 8, imgWidth: 20, imgHeight: 20 },
      'defaultValue': 'A4',
      'cascadeDisplay': { 'ddei.property.ds.none': { hidden: ['paper.direct', 'paper.width', 'paper.height', 'paper.unit'] }, 'ddei.property.ds.custom': { show: ['paper.direct', 'paper.width', 'paper.height', 'paper.unit'] }, notempty: { show: ['paper.direct'], hidden: ['paper.width', 'paper.height', 'paper.unit'] }, empty: { hidden: ['paper.width', 'paper.height', 'paper.unit'] }, default: { hidden: ['paper.width', 'paper.height', 'paper.unit'] } },
      'type': 1,
    },
    {
      'code': 'paper.width',
      'name': 'ddei.property.width',
      'desc': '用来设置纸张的宽度，以便于套用相关的样式',
      'controlType': 'text',
      'dataType': 'integer',
      'defaultValue': 210,
      'type': 1
    },
    {
      'code': 'paper.height',
      'name': 'ddei.property.height',
      'desc': '用来设置纸张的高度，以便于套用相关的样式',
      'controlType': 'text',
      'dataType': 'integer',
      'defaultValue': 297,
      'type': 1,
    },
    {
      'code': 'paper.unit',
      'name': 'ddei.property.unit',
      'desc': '用来设置纸张的宽高单位，以便于套用相关的样式',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.mm', 'value': 'mm' }, { 'text': 'ddei.property.ds.cm', 'value': 'cm' }, { 'text': 'ddei.property.ds.m', 'value': 'm' }, { 'text': 'ddei.property.ds.inch', 'value': 'inch' }, { 'text': 'ddei.property.ds.px', 'value': 'px' }],
      'defaultValue': 'mm',
    },
    {
      'code': 'paper.direct',
      'name': 'ddei.property.direct',
      'desc': '用来设置纸张的方向，以便于套用相关的样式',
      'controlType': 'radio',
      'dataSource': [{ 'text': 'ddei.property.ds.transverse', 'value': 1 }, { 'text': 'ddei.property.ds.portrait', 'value': 2 }],
      'dataType': 'integer',
      'defaultValue': 2,
      'type': 1,
    },

    {
      'code': 'mark.type',
      'name': 'ddei.property.markType',
      'desc': '用来快速选择水印的类型，以便于套用相关的样式',
      'controlType': 'radio',
      'dataSource': [{ 'text': 'ddei.property.ds.none', 'value': 0 }, { 'text': 'ddei.property.ds.text', 'value': 1 }, { 'text': 'ddei.property.ds.image', 'value': 2 }],
      'dataType': 'integer',
      'defaultValue': 0,
      'hiddenTitle': true,
      'display': 'column',
      'cascadeDisplay': { 1: { show: ['mark.data', 'mark.direct', 'mark.opacity', 'mark.font.family', 'mark.font.size', 'mark.font.color'] }, 2: { show: ['mark.data', 'mark.direct', 'mark.opacity'], hidden: ['mark.font.family', 'mark.font.size', 'mark.font.color'] }, empty: { hidden: ['mark.data', 'mark.direct', 'mark.opacity', 'mark.font.family', 'mark.font.size', 'mark.font.color'] } },
      'mapping': [],
      'type': 1,
    },
    {
      'code': 'mark.data',
      'name': 'ddei.property.mark',
      'desc': '当水印类型为1时，此字段将显示文本，当类行为2时，此字段显示为图片',
      'controlType': 'image',
      'dataType': 'string',
      'defaultValue': '',
      'type': 1,
    },

    {
      'code': 'mark.direct',
      'name': 'ddei.property.markDirect',
      'desc': '水印的显示方向',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.ltrd', 'value': '1' }, { 'text': 'ddei.property.ds.rtld', 'value': '2' }, { 'text': 'ddei.property.ds.horizontal', 'value': '3' }],
      'defaultValue': '1',
      'type': 1,
    },
    {
      'code': 'mark.opacity',
      'name': 'ddei.property.opacity',
      'desc': '透明度，0完全透明~1完全不透明',
      'controlType': 'range',
      'min': 0,
      'max': 1,
      'step': 0.01,
      'dataType': 'float',
      'defaultValue': 0.25,
      'display': 'column',
    },
    {
      'code': 'mark.font.family',
      'name': 'ddei.property.font',
      'desc': '文本的字体名称',
      'controlType': 'combox',
      'dataType': 'string',
      'dataSource': {
        'type': 'config',
        'data': 'fonts',
        'text': 'ch',
        'value': 'en',
        'bold': 'isSystemDefault',
        'fontFamily': 'en'
      },
      'itemStyle': { width: 80, height: 25, col: 2, row: 0, imgWidth: 20, imgHeight: 20 },
      'canSearch': true,
      'defaultValue': "",
    },
    {
      'code': 'mark.font.size',
      'name': 'ddei.property.size',
      'desc': '文本的字体大小',
      'max': 50,
      'min': 5,
      'step': 0.5,
      'controlType': 'font-size',
      'dataType': 'float',
      'defaultValue': 14,
    },
    {
      'code': 'mark.font.color',
      'name': 'ddei.property.color',
      'desc': '文本的颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': "",
    },
    {
      'code': 'ruler.display',
      'name': 'ddei.property.ruler',
      'desc': '是否显示标尺',
      'controlType': 'switch-checkbox',
      'dataType': 'integer',
      'defaultValue': 1,
      'display': 'column',
      'hiddenTitle': true,
      'type': 1,
      'cascadeDisplay': { 1: { show: ['ruler.unit'] }, default: { show: ['ruler.unit'] }, empty: { hidden: ['ruler.unit'] } },
    },
    {
      'code': 'ruler.unit',
      'name': 'ddei.property.unit',
      'desc': '用来设置标尺单位样式',
      'controlType': 'combox',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.mm', 'value': 'mm' }, { 'text': 'ddei.property.ds.cm', 'value': 'cm' }, { 'text': 'ddei.property.ds.m', 'value': 'm' }, { 'text': 'ddei.property.ds.inch', 'value': 'inch' }, { 'text': 'ddei.property.ds.px', 'value': 'px' }],
      'itemStyle': { width: 80, height: 25, col: 2, row: 0, imgWidth: 20, imgHeight: 20 },
      'defaultValue': 'mm',
      'type': 1,
    },
    {
      'code': 'grid.display',
      'name': 'ddei.property.grid',
      'desc': '设置网格线样式',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.none', 'value': '0' }, { 'text': 'ddei.property.ds.line', 'value': '1' }, { 'text': 'ddei.property.ds.point', 'value': '2' }],
      'defaultValue': '1',
      'type': 1,
    },
    {
      'code': 'global.jumpline',
      'name': 'ddei.property.jumpline',
      'desc': '遇到线交叉时，展示跳线',
      'controlType': 'switch-checkbox',
      'dataType': 'integer',
      'defaultValue': 1,
      'type': 1,
      'display': 'column',
      'hiddenTitle': true,
    },
  ],

  /**
   * 定义分组，用于属性编辑
   */
  groups: [
    {
      name: "ddei.style",
      icon: 'icon-setting',
      subGroups: [
        {
          name: "ddei.paper",
          attrs: ["paper.type", "paper.width", "paper.height", "paper.unit", "paper.direct"]
        },
        {
          name: "ddei.mark",
          attrs: ["mark.type", "mark.data", "mark.direct", "mark.opacity", "mark.font.family", "mark.font.size", "mark.font.color"]
        },
        {
          name: "ddei.assistant",
          attrs: ["ruler.display", "ruler.unit", "grid.display", "global.jumpline"]
        }

      ]
    }
  ]
}