<script lang="ts">
import DDeiEditorView from "./editor/Editor.vue";
import { DDeiCoreToolboxSimplePanel, DDeiCoreTopMenuSimplePanel, DDeiCoreThemeBlack, DDeiCoreControls, DDeiCoreHotkeys, DDeiKeyActionAllSelect, DDeiCorePropertyViewPanel, DDeiCoreToolboxPanel, DDeiCoreSheetsPanel, DDeiCoreChangeRatioPanel, DDeiCoreChangeRatioDialog, DDeiCoreShapeCountPanel, DDeiCoreBottomMenuPanel, DDeiCoreStandLayout, DDeiCoreSimpleLayout,DDeiCoreOpenFilesViewPanel, DDeiCoreThemeDefault } from "@ddei/core";
import { DDeiExtUML } from "@ddei/uml"
import { DDeiExtSearch } from "@ddei/search"
import { DDeiFuncCallResult, DDeiUtil, DDeiEditorUtil } from "ddei-framework";
import DDeiExtQuickStyle from "@ddei/quickstyle"
import DDeiExtTooltip from "@ddei/tooltip"
import { DDeiExtQuickControl, QuickChooseControlDialog } from "@ddei/quickcontrol"
import { defineComponent, markRaw } from "vue";
import DDeiExtHtmlViewer from "@ddei/htmlviewer"
import ReplaceDivDemo  from "./ReplaceDivDemo.vue";
import HtmlTooltipDemo from "./HtmlTooltipDemo.vue";
import {controls as ControlDefinesDemo,groups as GroupDefinesDemo} from "./controldefinesdemo"
import TopMenuViewerDemo from "./TopMenuViewerDemo.vue"
// import i18nJP from "./langs/ja_JP"

export default defineComponent({
  name: "APP",
  components: { DDeiEditorView },
  data() {
    
    const options = markRaw({
      currentLayout: "ddei-core-layout-simple",
      config: {
        // ratio: 1.2, //默认缩放比例为120%
        pixel:2, //调整渲染质量
        // readonly:1,
        // paper:"A6",
        // "mark": "水印文本",
        // EXT_STAGE_WIDTH: false,
        // EXT_STAGE_HEIGHT: false,
        // 自定义控件，接收一个object[]。由于定义内容较多，提取到外部，便于维护
        controlDefines: ControlDefinesDemo,
        // 自定义分组，接收一个object[]。由于定义内容较多，提取到外部，便于维护
        groupDefines: GroupDefinesDemo,
        initData: {
          controls: [
            // {
            //   model: "9999002"
            // },
            {
              id: "act_1",
              model: "102010",
              type: "emp_1",
              text: "第一步",
              border: { color: "yellow", dash: [10, 10, 5, 5], width: 5 },
              fill: { color: "grey" },
            }
              // {
              //   id: "act_1",
              // model: "103001",
              //   type: "emp_1",
              //   text: "第一步",
              //   border: { color: "yellow", width: 2 },
              //   fill: { color: "grey" },
              // },
              // {
              //   id: "act_2",
              //   model: "103010",
              //   type: "emp_2",
              //   width: 200,
              //   height: 100,
              //   text: "第二步",
              //   offsetY: -100,
              // }
            
          ]
        }
      },
      // i18n: {  //国际化配置
      //   lang: "ja_JP", //强制设定语言，如果不设置则读取浏览器的语言设置
      //   langs: { //导入自定义语言包，可以覆盖自带的语言包中相同的内容
      //     "ja_JP": i18nJP
      //   }
      // },
      extensions: [
        // //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          // 'top': [],
          'middle': ['ddei-core-panel-openfilesview', 'ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],// [!code ++]
          // 'bottom': [],
          // 'left': [],
          // 'right': []
        }),
        DDeiCoreSimpleLayout.configuration({
          other: ['ddei-core-panel-toolbox-simple', 'ddei-core-panel-topmenu-simple'],
          middle: ['ddei-core-panel-canvasview'],
          right: [],
          bottom: []
        }),
        DDeiExtUML,
        DDeiExtSearch.modify((plugin)=>{
          plugin.a = 1
        }),
        DDeiExtTooltip,
        DDeiExtQuickStyle,
        DDeiExtQuickControl,
        //配置htmlviewer插件，matchField用于声明图形控件中的属性与config中的key对应字段
        // DDeiExtHtmlViewer.configuration({
        //   matchField: "type", //匹配字段
        //   "emp_1": {          //key-value
        //     type: "emp_1",
        //     name: "张三",
        //     viewer: ReplaceDivDemo  //HTML模板控件
        //   },
        //   "emp_2": {
        //     type: "emp_2",
        //     name: "李四",
        //     viewer: ReplaceDivDemo
        //   },
        //   "emp_3": {
        //     type: "emp_3",
        //     name: "王五",
        //     viewer: ReplaceDivDemo
        //   }
        // })
        // QuickChooseControlDialog.configuration({ customGroups: ['101', '102'] }),
        // DDeiExtTooltip.configuration({
        //   'ddei-ext-dialog-tooltip':{
        //     viewer: HtmlTooltipDemo
        //   }
        // })
        // QuickChooseControlDialog.configuration({ customControls: ['100001', '100002','100003']})
        // DDeiCoreThemeBlack.configuration({
        //   default: true
        // }),
        // DDeiCoreOpenFilesViewPanel.configuration({ max: 3 })
      ]
    })
    const options1 = markRaw({
      currentLayout: "ddei-core-layout-simple",
      config: {
        // "readonly":true,
        "mark": "水印文本",
        "grid": 2,
        "paper": {type:"A6",direct:1},
        // "paper":"A5",
        "ruler": true,
        "background": {color:"#123456",opacity:0.1},
        // "theme": "ddei-core-theme-black",
        initData: {
          controls:[
            {
              id: "act_1",
              model: "102010",
              type: "emp_1",
              text: "第一步",
              border:{color:"yellow",dash:[10,10,5,5],width:5},
              fill:{color:"grey"},
            },
          //   {
          //     id: "act_2",
          //     model: "102010",
          //     type: "emp_2",
          //     width: 200,
          //     height: 100,
          //     text: "第二步",
          //     offsetY: -70,
          //   }
          ]
        }
      },
      //配置扩展插件
      extensions: [
        DDeiExtSearch.modify((plugin) => {
          plugin.b = 1
        }),
        DDeiExtQuickStyle,
        DDeiExtSearch,
        DDeiExtQuickControl,
        // DDeiCoreTopMenuSimplePanel.configuration({
        //   direct: 2,//方向，1纵向，2横向
        //   position: 3,//位置1-9顺时针，1为左上角，9为中心
        //   drag: 1,//是否允许拖拽位置
        //   items:[//自定义菜单
        //     {
        //       id:"ddei-core-save",
        //       name:"Save"
        //     },
        //     {
        //       id: "ddei-core-open",
        //       name: "打开"
        //     },
        //     {
        //       viewer: TopMenuViewerDemo
        //     },
        //     {
        //       id: "ddei-core-new",
        //       name: "新建"
        //     },
        //     {
        //       name: "测试",
        //       action: function (editor) {
        //         console.log("测试:" + editor.id)
        //       }
        //     }
        //   ]
        // }),
        
    

        // DDeiCoreStandLayout.configuration({
          //配置插件
          // 'top': [],
          // 'middle': ['ddei-core-panel-openfilesview', 'ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],
          // 'bottom': [],
          // 'left': [],
          // 'right': []
        // }),

      ],
    })

    const options2 = markRaw({
      
      config: {
        EXT_STAGE_WIDTH:false,
        GLOBAL_ALLOW_BACK_ACTIVE:true,
        // "readonly": true,
        access: { "DEL": false, "SCALE": false, "ROTATE": false },
        "paper":"无",
        "ruler": true,
        initData: {
          controls: [
            {
              id: "act_1",
              model: "102010",
              code: "active_01",
              text: "第一步",
              y: 70,
            },
            {
              id: "act_2",
              model: "102010",
              code: "active_02",
              width: 200,
              height: 100,
              text: "第二步",
              y: -70,
            }
          ]
        }
      },
      //配置扩展插件
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          'top': [],
          'middle': ['ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],
          'bottom': [],
          'left': [],
          'right': []
        }),
      ],
    })
    
    const options3 = markRaw({
      config: {
        EXT_STAGE_WIDTH:false,
        EXT_STAGE_HEIGHT:false,
        ruler:false,
        grid: 0,
        // readonly:true,
        initData: {
          controls: [
            {
              id: "rect_1",
              model: "102010",
              code: "active_01",
              width: 200,
              height: 100,
              text: "第一步"
            },
            {
              id: "rect_2",
              model: "102010",
              code: "active_02",
              width: 200,
              height: 100,
              text: "第二步"
            }
          ]
        }
      },
      //配置扩展插件
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          'top': [],
          'middle': ['ddei-core-panel-canvasview'],
          'bottom': [],
          'left': [],
          'right': []
        }),
        DDeiCoreThemeBlack.configuration({
          default: true
        }),
        DDeiExtQuickStyle
      ],
    })
    const options4 = markRaw({
      config: {

      },
      //配置扩展插件
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          'top': [],
          'middle': ['ddei-core-panel-canvasview'],
          'bottom': [],
          'left': [],
          'right': []
        }),
      ],
    })

    const jsontext2 = `
    {"name":"新建文件_NEW","desc":"","extData":{},"state":1,"publish":"0","lastUpdateTime":1721721532072,"path":"/新建文件_NEW","sheets":[{"name":"页面-1","desc":"页面-1","stage":{"id":"stage_1","layers":[{"id":"layer_default","name":"图层","models":{"task_1":{"id":"task_1","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":148.5,"y":105,"z":1},"hpv":[{"x":148.5,"y":105,"z":1},{"x":174.95833333333334,"y":105,"z":1}],"exPvs":{"_37ac7604d8c4643f80da10b3ac3cac6e":{"x":163.05208333333331,"y":107.72499999999997,"z":1,"rate":0.6471316085489304,"sita":10.60628276121123,"index":3,"id":"_37ac7604d8c4643f80da10b3ac3cac6e"}},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":177.60416666666669,"y":123.52083333333333,"z":1},"model":"102010"},"task_7":{"id":"task_7","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":166.35416666666663,"y":105.60833333333332,"z":1},"hpv":[{"x":166.35416666666663,"y":105.60833333333332,"z":1},{"x":192.81250000000003,"y":105.60833333333332,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":195.45833333333334,"y":124.12916666666663,"z":1},"model":"102010"},"line_8":{"id":"line_8","modelCode":"100401","modelType":"DDeiLine","hpv":[{"x":163.05208333333331,"y":107.72499999999997,"z":1},{"x":189.51041666666666,"y":107.72499999999997,"z":1}],"pvs":[{"x":163.05208333333331,"y":107.72499999999997,"z":1,"isVector3":true},{"x":182.75833333333333,"y":107.72499999999997,"z":1,"isVector3":true}],"exPvs":{},"mirrorX":false,"mirrorY":false,"sptStyle":{},"type":2,"freeze":0},"task_9":{"id":"task_9","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":183.55208333333331,"y":110.10624999999997,"z":1},"hpv":[{"x":183.55208333333331,"y":110.10624999999997,"z":1},{"x":210.01041666666663,"y":110.10624999999997,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":212.65624999999997,"y":128.62708333333327,"z":1},"model":"102010"},"task_10":{"id":"task_10","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":184.3458333333333,"y":112.22291666666665,"z":1},"hpv":[{"x":184.3458333333333,"y":112.22291666666665,"z":1},{"x":210.80416666666665,"y":112.22291666666665,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":213.44999999999996,"y":130.74374999999995,"z":1},"model":"102010"},"task_11":{"id":"task_11","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":184.3458333333333,"y":112.22291666666665,"z":1},"hpv":[{"x":184.3458333333333,"y":112.22291666666665,"z":1},{"x":210.80416666666665,"y":112.22291666666665,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":213.44999999999996,"y":130.74374999999995,"z":1},"model":"102010"},"task_12":{"id":"task_12","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":156.03541666666663,"y":104.8145833333333,"z":1},"hpv":[{"x":156.03541666666663,"y":104.8145833333333,"z":1},{"x":182.49374999999998,"y":104.8145833333333,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":185.13958333333332,"y":123.33541666666662,"z":1},"model":"102010"}},"midList":["task_1","task_7","line_8","task_9","task_10","task_11","task_12"],"modelType":"DDeiLayer","baseModelType":"DDeiLayer","index":-1,"background":null,"display":1,"lock":false,"print":true,"centerOpPoints":[],"modelCode":"DDeiLayer","modelChanged":true,"modelNumber":0}],"layerIndex":0,"idIdx":12,"modelType":"DDeiStage","ratio":1,"width":2245.0393700787404,"height":1587.4015748031497,"wpv":{"x":-615,"y":-375,"z":0},"links":[{"smid":"task_1","dmid":"line_8","smpath":"exPvs._37ac7604d8c4643f80da10b3ac3cac6e","dmpath":"startPoint"}],"spv":{"x":561.2598425196851,"y":396.85039370078744,"z":1},"modelCode":"DDeiStage","drawing":true,"copyMode":"copy","tempCursorOPpoint":{"x":1200,"y":813,"z":1,"isMiddle":true,"sita":180,"rate":0.5,"index":1,"plLength":0,"model":{"id":"task_9","modelCode":"102010","modelType":"DDeiPolygon","cpv":{"x":183.55208333333331,"y":110.10624999999997,"z":1},"hpv":[{"x":183.55208333333331,"y":110.10624999999997,"z":1},{"x":210.01041666666663,"y":110.10624999999997,"z":1}],"exPvs":{},"poly":2,"mirrorX":false,"mirrorY":false,"sptStyle":{},"text":"初始化图形","bpv":{"x":212.65624999999997,"y":128.62708333333327,"z":1},"model":"102010"},"mode":null},"unit":"mm"},"active":1,"modelType":"DDeiSheet","unicode":"0551c7341e1166a9b9000932cd46a41e"}],"currentSheetIndex":0,"modelType":"DDeiFile","modelNumber":0,"unicode":"22641afa27d069c986e615cae9600d0d","ddeiVersion":1237}
`
    
    return {
      options:options,
      options1:options1,
      options2:options2,
      options3:options3,
      options4:options4,
      jsontext2: jsontext2,
      jsontext:"无JSON"
    };
  },

  methods:{
    getData(){
      //获取编辑器实例
      let editor = this.$refs["editorViewer3"].editor;
      //获取整个editor的JSON
      let editorJSON = editor.toJSON();
      this.jsontext = JSON.stringify(editorJSON);
    },

    loadDataToEditor(){
      
      //获取编辑器实例
      let editor = this.$refs["editorViewer1"].editor;
      //获取整个editor的JSON
      let fileJSON = JSON.parse(this.jsontext2)
      editor.loadData(fileJSON)
      
    }
  }

  
});
</script>


<template>

  <DDeiEditorView ref="editorViewer1" :options="options" id="ddei_editor_1"></DDeiEditorView>


  
  <!-- <DDeiEditorView ref="editorViewer2" :options="options1" id="ddei_editor_2"></DDeiEditorView> -->
<!--
  <div style="width:400px;height:400px;float:left">
    <DDeiEditorView ref="editorViewer3" :options="options2" id="ddei_editor_3"></DDeiEditorView>
  </div>

  <button @click="getData" style="border:1px solid grey;margin-left:5px;padding:5px">获取JSON</button>
  <div style="width:400px;height:400px;margin:100px auto;">
    <textarea :value="jsontext"
      style="border:1px solid grey;margin-left:5px;padding:5px;width:100%;height:100%"></textarea>
  </div>

  <div style="width:500px;height:500px;float:left">
    <DDeiEditorView ref="editorViewer4" :options="options3" id="ddei_editor_4"></DDeiEditorView>
  </div>
  <div style="width:400px;height:400px;float:left">
    <DDeiEditorView ref="editorViewer5" :options="options4" id="ddei_editor_5"></DDeiEditorView>
  </div>
-->
</template>

<style>


</style>