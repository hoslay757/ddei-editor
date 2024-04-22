export const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '80px',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '300px',
    align: 'left'
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: '180px',
    align: 'left'
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    width: '80px',
    align: 'center'
  },
  {
    title: 'URI',
    dataIndex: 'uri',
    key: 'uri',
    align: 'center'
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
    ellipsis: true,
    width: '150px',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    align: 'center'
  },
  {
    title: '修改时间',
    dataIndex: 'update_time',
    key: 'update_time',
    align: 'center'
  },
  {
    title: '发布状态',
    dataIndex: 'publish',
    align: 'center',
    scopedSlots: { customRender: 'publish' }
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: '220px',
    align: 'center',
    scopedSlots: { customRender: 'operate' }
  }
]

export const designJsonStr = { "id": "ruledesigner", "containerid": "ruledesign_container", "width": 2028, "height": 1396, "attrs": {}, "controlType": "999", "modelType": "RuleCanvas", "curIndex": 4, "rootModels": { "begin_23_1": { "id": "begin_23_1", "code": "start", "x": 400, "y": 60, "width": 60, "height": 24, "text": "开始", "bindField": "", "feed": "1", "scale": "1", "modelType": "RuleBegin", "baseModelType": "Activity", "attrs": { "id": "begin_23_1", "code": "start", "text": "开始", "x": 400, "y": 60, "width": 60, "height": 24, "controlType": "1000204", "name": "开始", "desc": "", "align": "center", "valign": "bottom", "feed": "1", "scale": "1", "font": "ref:1", "border": "ref:2", "fill": "ref:3", "mouseoverlistener": "", "mouseoutlistener": "" }, "controlType": "1000204", "align": "center", "valign": "bottom", "border": "ref:2", "font": "ref:1", "fill": "ref:3" }, "compute_28_2": { "id": "compute_28_2", "code": "compute_2", "name": "计算", "x": 360, "y": 140, "width": 120, "height": 55, "text": "计算", "descText": "计算节点", "bindField": "", "feed": "1", "scale": "1", "modelType": "RuleCompute", "baseModelType": "Activity", "attrs": { "id": "compute_28_2", "code": "compute_2", "text": "计算", "descText": "计算节点", "x": 360, "y": 140, "width": 120, "height": 55, "controlType": "1000209", "name": "计算", "desc": "", "together": "n", "expression": "(1+2)*2", "align": "center", "valign": "middle", "feed": "1", "scale": "1", "font": "ref:4", "border": "ref:5", "fill": "ref:6", "imageInfo": "{\"path\":\"/test\",\"wight\":30,\"heigth\":30}", "mouseoverlistener": "", "mouseoutlistener": "" }, "controlType": "1000209", "align": "center", "valign": "middle", "expression": "(1+2)*2", "border": "ref:5", "font": "ref:4", "fill": "ref:6" }, "rd_line_3": { "id": "rd_line_3", "start": { "x": 428, "y": 84, "width": 4, "height": 4 }, "end": { "x": 418, "y": 136, "width": 4, "height": 4 }, "lineType": "2", "text": "", "modelType": "RDLine", "baseModelType": "Line", "attrs": { "id": "rd_line_3", "code": "rd_line_3", "lineType": "2", "start": { "x": 428, "y": 84, "width": 4, "height": 4 }, "end": { "x": 418, "y": 136, "width": 4, "height": 4 }, "controlType": "4000001", "text": "", "lineWeight": "2", "lineDash": "0", "lineOpacity": 1, "font": "ref:7", "fill": "ref:8", "mouseoverlistener": "", "mouseoutlistener": "" }, "controlType": "4000001", "startLinkGroupId": "begin_23_1_bottom", "endLinkGroupId": "compute_28_2_top", "lineDash": "0", "lineOpacity": 1, "lineWeight": "2", "font": "ref:7", "fill": "ref:8" } }, "linkGroups": { "begin_23_1_bottom": { "modelId": "begin_23_1", "type": "bottom", "lineIds": ["rd_line_3"] }, "compute_28_2_top": { "modelId": "compute_28_2", "type": "top", "lineIds": ["rd_line_3"] } }, "SAVE_TEMP_STYLE": { "1": "{\"default\":{\"family\":\"Arial Normal\",\"color\":\"white\",\"size\":\"14\"},\"selected\":{\"family\":\"Arial Normal\",\"color\":\"white\",\"size\":\"14\"}}", "2": "{\"default\":{\"left\":{\"width\":\"0\",\"color\":\"black\",\"dash\":\"\"},\"right\":{\"width\":\"0\",\"color\":\"black\",\"dash\":\"\"},\"top\":{\"width\":\"0\",\"color\":\"black\",\"dash\":\"\"},\"bottom\":{\"width\":\"0\",\"color\":\"black\",\"dash\":\"\"}},\"selected\":{\"left\":{\"width\":\"0\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"right\":{\"width\":\"0\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"top\":{\"width\":\"0\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"bottom\":{\"width\":\"0\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"}}}", "3": "{\"default\":{\"color\":\"rgba(217, 0, 27, 1)\"},\"selected\":{\"color\":\"rgba(217, 0, 27, 1)\"}}", "4": "{\"default\":{\"family\":\"Arial Normal\",\"color\":\"black\",\"size\":\"8\"},\"selected\":{\"family\":\"Arial Normal\",\"color\":\"black\",\"size\":\"8\"}}", "5": "{\"default\":{\"left\":{\"width\":\"1\",\"color\":\"black\",\"dash\":\"\"},\"right\":{\"width\":\"1\",\"color\":\"black\",\"dash\":\"\"},\"top\":{\"width\":\"1\",\"color\":\"black\",\"dash\":\"\"},\"bottom\":{\"width\":\"1\",\"color\":\"black\",\"dash\":\"\"}},\"selected\":{\"left\":{\"width\":\"3\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"right\":{\"width\":\"3\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"top\":{\"width\":\"3\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"},\"bottom\":{\"width\":\"3\",\"color\":\"rgba(90, 154, 239, 90)\",\"dash\":\"\"}}}", "6": "{\"default\":{\"color\":\"rgba(255, 255, 255, 255)\"},\"selected\":{\"color\":\"rgba(255, 255, 255, 255)\"}}", "7": "{\"default\":{\"family\":\"STSong-Light\",\"color\":\"red\",\"size\":\"22\"},\"selected\":{\"family\":\"STSong-Light\",\"color\":\"blue\",\"size\":\"24\"}}", "8": "{\"default\":{\"color\":\"grey\"},\"selected\":{\"color\":\"yellow\"}}" } }