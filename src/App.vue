<script lang="ts">
import DDeiEditorView from "./editor/Editor.vue";
import { DDeiCoreTopMenuPanel, DDeiCoreThemeBlack, DDeiCoreControls, DDeiCoreHotkeys, DDeiKeyActionAllSelect, DDeiCorePropertyViewPanel, DDeiCoreToolboxPanel, DDeiCoreSheetsPanel, DDeiCoreChangeRatioPanel, DDeiCoreChangeRatioDialog, DDeiCoreShapeCountPanel, DDeiCoreBottomMenuPanel, DDeiCoreStandLayout, DDeiCoreOpenFilesViewPanel, DDeiCoreThemeDefault } from "@ddei/core";
import { DDeiExtUML } from "@ddei/uml"
import { DDeiExtSearch } from "@ddei/search"
import { DDeiFuncCallResult, DDeiUtil, DDeiEditorUtil } from "ddei-framework";
import DDeiExtQuickStyle from "@ddei/quickstyle"
import DDeiExtTooltip from "@ddei/tooltip"
import { DDeiExtQuickControl, QuickChooseControlDialog } from "@ddei/quickcontrol"
import { defineComponent, markRaw } from "vue";
import DDeiExtHtmlViewer from "@ddei/htmlviewer"
import ReplaceDivDemo  from "./ReplaceDivDemo.vue";
export default defineComponent({
  name: "APP",
  components: { DDeiEditorView, ReplaceDivDemo },
  data() {
    
    const options = markRaw({
      config: {
        paper:"A6",
        // EXT_STAGE_WIDTH: false,
        // EXT_STAGE_HEIGHT: false,
      },
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          // 'top': [],
          'middle': ['ddei-core-panel-openfilesview', 'ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],// [!code ++]
          // 'bottom': [],
          // 'left': [],
          // 'right': []
        }),
        DDeiExtUML,
        DDeiExtSearch,
        DDeiExtQuickStyle,
        DDeiExtQuickControl,
        QuickChooseControlDialog.configuration({ customGroups: ['101', '102'] }),
        DDeiExtTooltip
        // QuickChooseControlDialog.configuration({ customControls: ['100001', '100002','100003']})
        // DDeiCoreThemeBlack.configuration({
        //   default: true
        // }),
        // DDeiCoreOpenFilesViewPanel.configuration({ max: 3 })
      ]
    })
    const options1 = markRaw({
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
              code: "emp_1",
              text: "第一步",
              border:{color:"yellow",dash:[10,10,5,5],width:5},
              fill:{color:"grey"},
            },
            {
              id: "act_2",
              model: "102010",
              code: "emp_2",
              width: 200,
              height: 100,
              text: "第二步",
              offsetY: -70,
            }
          ]
        }
      },
      //配置扩展插件
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuration({
          //配置插件
          // 'top': [],
          'middle': ['ddei-core-panel-openfilesview', 'ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],
          // 'bottom': [],
          // 'left': [],
          // 'right': []
        }),
        DDeiExtSearch,
        DDeiExtQuickStyle,
        DDeiExtQuickControl,
        DDeiExtTooltip,
        DDeiExtHtmlViewer.configuration({
          "emp_1":{
            code:"emp_1",
            name: "张三",
            viewer: ReplaceDivDemo
          },
          "emp_2": {
            code: "emp_2",
            name: "李四",
            viewer: ReplaceDivDemo
          },
          "emp_3": {
            code: "emp_3",
            name: "王五",
            viewer: ReplaceDivDemo
          },
        })
        
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

   
    
    return {
      options:options,
      options1:options1,
      options2:options2,
      options3:options3,
      options4:options4,
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
    }
  }

  
});
</script>


<template>
  <div v-for="data in demoData" :id="'demo_replace_div_' + data.code" :ref="'demo_replace_div_' + data.code"
    style="display: flex;flex-direction:column;text-align:center;align-items: center;text-align: center;width:200px;background: white;color:black;position: absolute;display: none;">
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">代码</div>
      <div style="flex:1">{{ data.code }}</div>
    </div>
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">名称</div>
      <div style="flex:1">{{ data.name }}</div>
    </div>
  </div>

  <div style="width:500px;height:500px;overflow: auto;margin:auto;margin-top:200px;">
    <div style="width:80vw;height:80vh;">
      <DDeiEditorView ref="editorViewer1" :options="options" id="ddei_editor_1"></DDeiEditorView>
    </div>
  </div>
 
  <DDeiEditorView ref="editorViewer2" :options="options1" id="ddei_editor_2"></DDeiEditorView>
  
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

</template>

<style>
body {
  display: block;
}

#app {
  padding: 0;
  margin: 0;
  display: block;
  max-width: 100%;
  touch-action: none;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>