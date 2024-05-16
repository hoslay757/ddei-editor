<script lang="ts">
import DDeiEditorView from "./editor/Editor.vue";
import { DDeiCoreTopMenuPanel, DDeiCoreThemeBlack, DDeiCoreControls, DDeiCoreHotkeys, DDeiKeyActionAllSelect, DDeiCorePropertyViewPanel, DDeiCoreToolboxPanel, DDeiCoreSheetsPanel, DDeiCoreChangeRatioPanel, DDeiCoreChangeRatioDialog, DDeiCoreShapeCountPanel, DDeiCoreBottomMenuPanel, DDeiCoreStandLayout, DDeiCoreOpenFilesViewPanel, DDeiCoreThemeDefault } from "@ddei/core";
import { DDeiExtUML } from "@ddei/uml"
import { DDeiFuncCallResult } from "ddei-framework";
import DDeiExtQuickStyle from "@ddei/quickstyle"
import { defineComponent, markRaw } from "vue";
export default defineComponent({
  name: "APP",
  components: { DDeiEditorView },
  data() {
    
    const options = markRaw({
      config: {
      
      },
      extensions: [
        DDeiCoreThemeBlack.configuration({
          default: true
        }),
      ]
    })
    const options1 = markRaw({
      config: {
        "readonly":true,
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
              code: "active_01",
              text: "第一步",
              border:{color:"yellow",dash:[10,10,5,5],width:5},
              fill:{color:"grey"},
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

      ],
    })

    const options2 = markRaw({
      
      config: {
        EXT_STAGE_WIDTH:false,
        // "readonly": true,
        access:{"DEL":false},
        "paper":"A5",
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
      options4:options4
    };
  },

  methods:{
  }

  
});
</script>


<template>
  <DDeiEditorView ref="editorViewer1" :options="options" id="ddei_editor_1"></DDeiEditorView>
  <DDeiEditorView ref="editorViewer2" :options="options1" id="ddei_editor_2"></DDeiEditorView>
  <div style="width:400px;height:400px;float:left">
    <DDeiEditorView ref="editorViewer3" :options="options2" id="ddei_editor_3"></DDeiEditorView>
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