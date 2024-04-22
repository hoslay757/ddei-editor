export default {
  'id': '100301',
  'name': '表格',
  'code': 'table',
  'desc': '表格控件，可以通过插入、移动、合并单元格完成复杂的布局',
  'type': 'DDeiTable',
  'icon': 'icon-table',
  'subcontrol': '100302'
}


/**
 * 定义组件的样式属性,样式属性会影响图形的显示，修改样式属性也会刷新图形
 * 样式属性通常从001段ID开始计数
 * 属性采用三层结构：组（styles、datas、events）、子分组（group）、以及属性
 * 特殊属性：
 *    code属性编码在统一个组中，code唯一
 *    mapping建立与模型中属性的映射关系，为null时为默认，采用code指向的属性映射；mapping为[]时交由控件编辑器处理值映射
 *    hiddenTitle隐藏标题，为true时不会显示属性标题，默认false不隐藏标题
 *    display控件显示模式，有row（横向排列）和column（纵向排列）两个选项，默认row
 */
export const styles = {
  'name': '样式',
  'children': [
    {
      'id': '100301001',
      'code': 'width',
      'name': '宽度',
      'desc': '控件的宽度',
      'group': '布局',
      'controlType': 'text',
      'dataSource': null,
      'dataType': 'integer',
      'defaultValue': "600",
      'orderNo': 1,
      'visiable': false
    },
    {
      'id': '100301002',
      'code': 'height',
      'name': '高度',
      'desc': '控件的高度',
      'group': '布局',
      'controlType': 'text',
      'dataSource': null,
      'dataType': 'integer',
      'defaultValue': "200",
      'orderNo': 2,
      'visiable': false
    },
    {
      'id': '100301003',
      'code': 'border.type',
      'name': '边框类型',
      'desc': '用来快速选择边框的类型，以便于套用相关的样式',
      'group': '边框',
      'controlType': 'border-type',
      'dataSource': [{ 'text': '无线条', 'value': '0' }, { 'text': '实线', 'value': '1' }],
      'dataType': 'string',
      'defaultValue': '1',
      'hiddenTitle': true,
      'display': 'column',
      'exmapping': ['border.top.disabled', 'border.right.disabled', 'border.bottom.disabled', 'border.left.disabled'],
      'orderNo': 1,
      'visiable': true
    },
    {
      'id': '100301004',
      'code': 'border.color',
      'name': '颜色',
      'desc': '图形的边框显示颜色，在高级设置中，可以分别设置不同方向边框的样式',
      'group': '边框',
      'controlType': 'color-combo',
      'mapping': ["border.top.color", "border.right.color", "border.bottom.color", "border.left.color"],
      'dataType': 'string',
      'defaultValue': 'black',
      'orderNo': 2,
      'visiable': true
    },
    {
      'id': '100301005',
      'code': 'borderOpacity',
      'name': '透明度',
      'desc': '图形的边框的透明度，0完全透明~1完全不透明',
      'group': '边框',
      'controlType': 'range',
      'min': 0,
      'max': 1,
      'step': 0.01,
      'mapping': ["border.top.opacity", "border.right.opacity", "border.bottom.opacity", "border.left.opacity"],
      'dataType': 'float',
      'defaultValue': 1,
      'display': 'column',
      'orderNo': 3,
      'visiable': true
    },
    {
      'id': '100301006',
      'code': 'borderWidth',
      'name': '粗细',
      'desc': '图形的边框的粗细，0为无边框',
      'group': '边框',
      'controlType': 'range',
      'min': 0,
      'max': 10,
      'step': 0.1,
      'mapping': ["border.top.width", "border.right.width", "border.bottom.width", "border.left.width"],
      'dataType': 'integer',
      'defaultValue': 1,
      'orderNo': 4,
      'visiable': true
    },
    {
      'id': '100301007',
      'code': 'borderDash',
      'name': '虚线',
      'desc': '图形的边框的是否为虚线样式，虚线由长短不一的线段构成',
      'group': '边框',
      'controlType': 'combox',
      'dataSource': [
        { 'img': 'icon-line-00', 'text': '1', 'value': [] },
        { 'img': 'icon-line-00', 'text': '2', 'value': [10, 5] },
        { 'img': 'icon-line-00', 'text': '3', 'value': [5, 5] },
        { 'img': 'icon-line-00', 'text': '4', 'value': [10, 4, 2, 4] },
        { 'img': 'icon-line-00', 'text': '5', 'value': [10, 4, 2, 4, 2, 4] },
        { 'img': 'icon-line-00', 'text': '6', 'value': [10, 4, 10, 4, 2, 4] },
        { 'img': 'icon-line-00', 'text': '7', 'value': [20, 5, 10, 5] },
        { 'img': 'icon-line-00', 'text': '8', 'value': [20, 5, 10, 5, 10, 5] },
        { 'img': 'icon-line-00', 'text': '9', 'value': [3, 3] },
        { 'img': 'icon-line-00', 'text': '10', 'value': [2, 2] },
        { 'img': 'icon-line-00', 'text': '11', 'value': [3, 2, 2, 2] },
        { 'img': 'icon-line-00', 'text': '12', 'value': [3, 2, 2, 2, 2, 2] },
      ],
      'itemStyle': { width: 80, height: 25, col: 2, row: 6, imgWidth: 60, imgHeight: 20, display: "img-text" },
      'mapping': ["border.top.dash", "border.right.dash", "border.bottom.dash", "border.left.dash"],
      'dataType': 'integer',
      'defaultValue': [],
      'isArray': true,
      'orderNo': 5,
      'visiable': true
    },
    {
      'id': '100301008',
      'code': 'borderRound',
      'name': '圆角',
      'desc': '图形的边框的是否为为圆角的弧度',
      'group': '边框',
      'controlType': 'range',
      'mapping': ["border.top.round", "border.right.round", "border.bottom.round", "border.left.round"],
      'min': 0,
      'max': 100,
      'step': 1,
      'defaultValue': 0,
      'dataType': 'integer',
      'orderNo': 6,
      'visiable': true
    },
    {
      'id': '100301305',
      'code': 'borderCreatingOpacity',
      'name': '透明度',
      'desc': '图形的边框的透明度，0完全透明~1完全不透明',
      'group': '边框',
      'controlType': 'text',
      'mapping': ["border.creating.top.opacity", "border.creating.right.opacity", "border.creating.bottom.opacity", "border.creating.left.opacity"],
      'dataType': 'float',
      'defaultValue': 0.5,
      'display': 'column',
      'orderNo': 3,
      'visiable': false
    },
    {
      'id': '100301306',
      'code': 'fillCreatingOpacity',
      'name': '透明度',
      'desc': '图形的填充的透明度，0完全透明~1完全不透明',
      'group': '填充',
      'controlType': 'text',
      'mapping': ["fill.creating.opacity"],
      'dataType': 'float',
      'defaultValue': 0.5,
      'display': 'column',
      'orderNo': 3,
      'visiable': false
    },
  ],
  'visiable': false,
  'order': 1
}

/**
 * 定义组件的数据属性，数据属性一般用于业务就算，修改数据属性一般不会刷新图形，除非数据属性和样式属性产生联动关系
 * 数据属性通常占用400段ID，开始计数
 */
export const datas = {
  'name': '数据',
  'children': [
    {
      'id': '100301401',
      'code': 'id',
      'name': 'id',
      'desc': '控件在画布的全局唯一ID',
      'group': '基础信息',
      'controlType': 'text',
      'dataType': 'string',
      'readonly': true,
      'orderNo': 1,
      'visiable': false
    },
    {
      'id': '100301402',
      'code': 'code',
      'name': '编码',
      'desc': '控件在业务上的唯一编码，缺省和控件ID一致',
      'group': '基础信息',
      'controlType': 'text',
      'dataType': 'string',
      'defaultValue': '编码001',
      'orderNo': 2,
      'visiable': true
    },

  ],
  'visiable': true,
  'order': 1
}


/**
 * 定义组件的事件属性，事件属性一般用于外部扩展
 * 数据属性通常占用800段ID，开始计数
 */
export const events = {
  'name': '事件',
  'children': [
  ],
  'visiable': false,
  'order': 3
}



/**
 * 定义组件的右键菜单
 */
export const menus = [
  {
    'code': 'insert-row',
    'name': '插入行',
    'icon': 'icon-insert-row',
  },
  {
    'code': 'insert-col',
    'name': '插入列',
    'icon': 'icon-insert-col',
  },
  {
    'code': 'remove-row',
    'name': '删除行',
    'icon': 'icon-delete-row',
  },
  {
    'code': 'remove-col',
    'name': '删除列',
    'icon': 'icon-delete-column',
  },
  {
    'code': 'split',
  },
  {
    'code': 'merge-cell',
    'name': '合并单元格',
    'icon': 'icon-merge-cells',
  },
  {
    'code': 'cancel-merge-cell',
    'name': '取消合并单元格',
    'icon': 'icon-merge-cells',
  },

]
