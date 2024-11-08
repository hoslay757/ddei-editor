export default {
  'id': '100201',
  'name': '矩形容器',
  'code': 'rectange_container',
  'desc': '矩形形状的容器，能够包含其他容器',
  'type': 'DDeiRectContainer',

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
      'code': 'layout',
      'name': '布局',
      'desc': '文本的字体名称',
      'controlType': 'radio',
      'dataSource': [
        { 'text': '自由布局', 'value': 'free' },
        { 'text': '完全填充', 'value': 'full' },
        { 'text': '九宫格', 'value': 'nine' },
        { 'text': '表格', 'value': 'table' },
        { 'text': '圆心', 'value': 'cc' },
      ],
      'defaultValue': null,
      'hiddenTitle': true,
      'display': 'column',
      'dataType': 'string',
    },
    {
      'code': 'width',
      'name': 'ddei.property.width',
      'desc': '控件的宽度',
      'controlType': 'text',
      'dataSource': null,
      'dataType': 'integer',
      'defaultValue': "150",
    },
    {
      'code': 'height',
      'name': 'ddei.property.height',
      'desc': '控件的高度',
      'controlType': 'text',
      'dataSource': null,
      'dataType': 'integer',
      'defaultValue': "150",
    },
    {
      'id': '100500003',
      'code': 'border.type',
      'name': 'ddei.property.borderType',
      'desc': '用来快速选择边框的类型，以便于套用相关的样式',
      'controlType': 'border-type',
      'dataSource': [{ 'text': 'ddei.property.ds.none', 'value': 0 }, { 'text': 'ddei.property.ds.line', 'value': 1 }],
      'dataType': 'string',
      'defaultValue': '1',
      'hiddenTitle': true,
      'display': 'column',
    },
    {
      'id': '100500004',
      'code': 'border.color',
      'name': 'ddei.property.color',
      'desc': '图形的边框显示颜色，在高级设置中，可以分别设置不同方向边框的样式',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': 'black',
    },
    {
      'code': 'borderOpacity',
      'name': 'ddei.property.opacity',
      'desc': '图形的边框的透明度，0完全透明~1完全不透明',
      'controlType': 'range',
      'min': 0,
      'max': 1,
      'step': 0.01,
      'mapping': ["border.opacity"],
      'dataType': 'float',
      'defaultValue': 1,
      'display': 'column',
    },
    {
      'code': 'borderWidth',
      'name': 'ddei.property.width',
      'desc': '图形的边框的粗细，0为无边框',
      'controlType': 'range',
      'min': 0,
      'max': 10,
      'step': 0.1,
      'mapping': ["border.width"],
      'dataType': 'integer',
      'defaultValue': 1,
    },
    {
      'code': 'borderDash',
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
      'mapping': ["border.dash"],
      'dataType': 'integer',
      'defaultValue': [],
      'isArray': true,
    },
    {
      'code': 'borderRound',
      'name': 'ddei.property.round',
      'desc': '图形的边框的是否为为圆角的弧度',
      'controlType': 'range',
      'mapping': ["border.round"],
      'min': 0,
      'max': 30,
      'step': 1,
      'defaultValue': 0,
      'dataType': 'integer',
    },
    {
      'code': 'fill.type',
      'name': 'ddei.property.fillType',
      'desc': '图形填充的类型快速设置',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.none', 'value': 0 }, { 'text': 'ddei.property.ds.color', 'value': 1 }, { 'text': 'ddei.property.ds.image', 'value': 2 }],
      'defaultValue': 1,
      'type': 1,
      'orderNo': 2,
      'cascadeDisplay': { 1: { show: ['fill.color', 'fill.opacity'], hidden: ['fill.image'] }, 2: { show: ['fill.image', 'fill.opacity'], hidden: ['fill.color'] }, default: { show: ['fill.color', 'fill.opacity'], hidden: ['fill.image'] }, empty: { hidden: ['fill.color', 'fill.image', 'fill.opacity'] } },
      'hiddenTitle': true,
      'display': 'column',
    },
    {
      'code': 'fill.color',
      'name': 'ddei.property.color',
      'desc': '图形的填充颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': 'white',
    },
    {
      'code': 'fill.image',
      'name': 'ddei.property.image',
      'desc': '图形的填充图片',
      'controlType': 'text',
      'dataType': 'string',
      'defaultValue': '',
      'type': 1,
    },
    {
      'code': 'fill.opacity',
      'name': 'ddei.property.opacity',
      'desc': '图形的填充的透明度，0完全透明~1完全不透明',
      'controlType': 'range',
      'min': 0,
      'max': 1,
      'step': 0.01,
      'defaultValue': 1,
      'dataType': 'float',
      'display': 'column',
    },


    {
      'code': 'font.family',
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
      'defaultValue': "Microsoft YaHei",
    },
    {
      'code': 'font.size',
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
      'code': 'font.color',
      'name': 'ddei.property.color',
      'desc': '文本的颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': "#252525",
    },
    {
      'code': 'fontAlign',
      'name': 'ddei.property.align',
      'desc': '文本的对齐，采用九宫格式设置',
      'controlType': 'align-type',
      'mapping': [],
      'dataType': 'string',
    },
    {
      'code': 'textStyle.feed',
      'name': 'ddei.property.feed',
      'desc': '自动换行',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.scale',
      'name': 'ddei.property.outSize',
      'desc': '文本的自动缩小字体填充',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.hollow',
      'name': 'ddei.property.hollow',
      'desc': '文本的镂空显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.bold',
      'name': 'ddei.property.bold',
      'desc': '文本的加粗显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.italic',
      'name': 'ddei.property.italic',
      'desc': '文本的斜体显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.underline',
      'name': 'ddei.property.underline',
      'desc': '文本的下划线显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.deleteline',
      'name': 'ddei.property.deleteline',
      'desc': '文本的删除线显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.topline',
      'name': 'ddei.property.topline',
      'desc': '文本的删除线显示',
      'controlType': 'radio',
      'dataType': 'string',
      'dataSource': [{ 'text': 'ddei.property.ds.yes', 'value': '1' }, { 'text': 'ddei.property.ds.no', 'value': '0' }],
      'defaultValue': '0',
    },
    {
      'code': 'textStyle.bgcolor',
      'name': 'ddei.property.textbg',
      'desc': '文本的背景颜色',
      'controlType': 'color-combo',
      'dataType': 'string',
      'defaultValue': '',
    },
    {
      'code': 'textStyle.subtype',
      'name': 'ddei.property.subtype',
      'desc': '文本的标注类型',
      'controlType': 'radio',
      'dataType': 'integer',
      'dataSource': [{ 'text': 'ddei.property.ds.subType', 'value': 0 }, { 'text': 'ddei.property.ds.subType1', 'value': 1 }, { 'text': 'ddei.property.ds.subType2', 'value': 2 }, { 'text': 'ddei.property.ds.subType3', 'value': 3 }],
      'defaultValue': 0,
    },

    {
      'code': 'textStyle.align',
      'name': 'ddei.property.textAlign',
      'desc': '文本的水平对齐',
      'controlType': 'text',
      'dataType': 'integer',
      'defaultValue': 2,
    },
    {
      'code': 'textStyle.valign',
      'name': 'ddei.property.textValign',
      'desc': '文本的垂直对齐',
      'controlType': 'text',
      'dataType': 'integer',
      'defaultValue': 2,
    },
    {
      'code': 'textStyle.hspace',
      'name': 'ddei.property.hspace',
      'desc': '文本之间的水平间距',
      'controlType': 'range',
      'min': 0,
      'max': 10,
      'step': 0.1,
      'dataType': 'float',
      'defaultValue': 0.5,
    },
    {
      'code': 'textStyle.vspace',
      'name': 'ddei.property.vspace',
      'desc': '文本之间的垂直间距',
      'controlType': 'range',
      'min': 0,
      'max': 10,
      'step': 0.1,
      'dataType': 'float',
      'defaultValue': 0.5,
    },
    {
      'code': 'borderCreatingOpacity',
      'name': 'ddei.property.opacity',
      'desc': '图形的边框的透明度，0完全透明~1完全不透明',
      'controlType': 'text',
      'mapping': ["border.creating.top.opacity", "border.creating.right.opacity", "border.creating.bottom.opacity", "border.creating.left.opacity"],
      'dataType': 'float',
      'defaultValue': 0.5,
      'display': 'column',
    },
    {
      'code': 'fillCreatingOpacity',
      'name': 'ddei.property.opacity',
      'desc': '图形的填充的透明度，0完全透明~1完全不透明',
      'controlType': 'text',
      'mapping': ["fill.creating.opacity"],
      'dataType': 'float',
      'defaultValue': 0.5,
      'display': 'column',
    },
    {
      'code': 'imageCreatingOpacity',
      'name': 'ddei.property.opacity',
      'desc': '图形的填充图片的透明度，0完全透明~1完全不透明',
      'controlType': 'text',
      'mapping': ["fill.creating.opacity"],
      'dataType': 'float',
      'defaultValue': 0.5,
      'display': 'column',
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
    {
      'code': 'text',
      'name': 'ddei.property.text',
      'desc': '控件的主体显示文本',
      'controlType': 'textarea',
      'defaultValue': '',
      'dataType': 'string',
      'type': [1, 2], //类别，1图形，2业务，3事件
      'readonly': true,
    },
    {
      'code': 'fmt.type',
      'name': 'ddei.format',
      'desc': '文本的显示格式',
      'controlType': 'radio',
      'dataType': 'integer',
      'dataSource': [{ 'text': 'ddei.property.ds.text', 'value': 0 }, { 'text': 'ddei.property.ds.decimal', 'value': 1 }, { 'text': 'ddei.property.ds.money', 'value': 2 }, { 'text': 'ddei.property.ds.time', 'value': 3 }],
      'defaultValue': 0,
      'type': [1, 2],
      'cascadeDisplay': { 1: { show: ['fmt.nscale', 'fmt.tmark'], hidden: ['fmt.mmark', 'fmt.munit', 'fmt.dtype', 'fmt.format', 'fmt.mrmb'] }, 2: { show: ['fmt.nscale', 'fmt.tmark', 'fmt.mmark', 'fmt.munit', 'fmt.mrmb'], hidden: ['fmt.dtype', 'fmt.format'] }, 3: { show: ['fmt.dtype', 'fmt.format'], hidden: ['fmt.mrmb', 'fmt.tmark', 'fmt.mmark', 'fmt.munit', 'fmt.nscale'] }, default: { hidden: ['fmt.tmark', 'fmt.mmark', 'fmt.munit', 'fmt.nscale', 'fmt.dtype', 'fmt.format', 'fmt.mrmb'] }, empty: { hidden: ['fmt.tmark', 'fmt.mmark', 'fmt.munit', 'fmt.nscale', 'fmt.dtype', 'fmt.format', 'fmt.mrmb'] } },
    },
    {
      'code': 'fmt.nscale',
      'name': 'ddei.property.nscale',
      'desc': '格式化小数位数',
      'controlType': 'range',
      'min': 0,
      'max': 5,
      'dataType': 'integer',
      'defaultValue': 0,
      'type': [1, 2]
    },
    {
      'code': 'fmt.tmark',
      'name': 'ddei.property.tmark',
      'desc': '显示逗号千分符',
      'controlType': 'switch-checkbox',
      'dataType': 'integer',
      'defaultValue': 0,
      'hiddenTitle': true,
      'display': 'column',
      'type': [1, 2]
    },
    {
      'code': 'fmt.mmark',
      'name': 'ddei.property.mmark',
      'desc': '显示货币符号',
      'controlType': 'combox',
      'dataSource': [{ 'text': 'ddei.property.ds.none', 'value': '' }, { 'text': 'ddei.property.ds.money1', 'value': '¥' }, { 'text': 'ddei.property.ds.money2', 'value': '$' }, { 'text': 'ddei.property.ds.money3', 'value': '€' }, { 'text': 'ddei.property.ds.money4', 'value': '£' }, { 'text': 'ddei.property.ds.money5', 'value': '￥' }, { 'text': 'ddei.property.ds.money6', 'value': '₽' }, { 'text': 'ddei.property.ds.money7', 'value': '€' }],
      'defaultValue': '',
      'dataType': 'string',
      'type': [1, 2],
      'itemStyle': { width: 80, height: 25, col: 2, row: 0, imgWidth: 20, imgHeight: 20 },
    },
    {
      'code': 'fmt.munit',
      'name': 'ddei.property.moneyUnit',
      'desc': '显示在后方的货币单位',
      'controlType': 'text',
      'defaultValue': '',
      'dataType': 'string',
      'type': [1, 2]
    },
    {
      'code': 'fmt.mrmb',
      'name': 'ddei.property.moneyUpCase',
      'desc': '显示为人民币大写',
      'controlType': 'switch-checkbox',
      'dataType': 'integer',
      'defaultValue': 0,
      'hiddenTitle': true,
      'display': 'column',
      'type': [1, 2]
    },
    {
      'code': 'fmt.dtype',
      'name': 'ddei.property.dateType',
      'desc': '日期和时间的格式化类型',
      'controlType': 'radio',
      'dataSource': [{ 'text': '2023-01-01', 'value': 1 }, { 'text': '23:59:59', 'value': 2 }, { 'text': '2023-01-01 23:59:59', 'value': 3 }, { 'text': 'ddei.property.ds.custom', 'value': 99 }],
      'dataType': 'integer',
      'defaultValue': 1,
      'hiddenTitle': true,
      'display': 'column',
      'cascadeDisplay': { 1: { show: [], hidden: ['fmt.format'] }, 2: { show: [], hidden: ['fmt.format'] }, 3: { show: [], hidden: ['fmt.format'] }, 99: { hidden: [], show: ['fmt.format'] }, default: { hidden: ['fmt.format'] }, empty: { hidden: ['fmt.format'] } },
    },
    {
      'code': 'fmt.format',
      'name': 'ddei.property.format',
      'desc': '自定义格式化字符串',
      'controlType': 'text',
      'dataType': 'string',
    }


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
          name: "ddei.layout",
          attrs: ["layout"]
        },
        {
          name: "ddei.fill",
          attrs: ["fill.type", "fill.color", "fill.image", "fill.opacity"]
        },
        {
          name: "ddei.line",
          attrs: ["border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound"]
        },
      ]
    },
  ]
}