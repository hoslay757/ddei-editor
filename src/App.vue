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
        width: 2000,
        height:2000,
        ratio: 1.5,
        theme: "black",
        EXT_STAGE_WIDTH:false,
        GLOBAL_HELP_LINE_ENABLE:false,
        GLOBAL_ALLOW_STAGE_RATIO:false,
        GLOBAL_KEYBOARD_ALIGN_ENABLE:false,
        GLOBAL_ALLOW_OPEN_MULT_LAYERS:false,
        EVENT_CONTROL_SELECT_AFTER: function(){
          console.log("select-after")
          let rs = DDeiFuncCallResult
          rs.state = 1;
          return rs
        }
      },
      //配置扩展插件
      extensions: [
        //布局的配置
        DDeiCoreStandLayout.configuraton({
          //配置插件
          'top': [DDeiCoreTopMenuPanel],
          'middle': [DDeiCoreOpenFilesViewPanel.configuraton({
            drag: true
          }), 'ddei-core-panel-canvasview', 'ddei-core-panel-quickcolorview'],
        }),
        //特殊控件的配置
        DDeiCoreControls.configuraton({
          '100002': {
            border: { color: 'red', width: 3 }
          },
          '100001': {
            border: { color: 'yellow' }
          }
        }),

        DDeiCoreThemeBlack.configuraton({
          default: true
        }),
        //批量快捷键配置
        DDeiCoreHotkeys.configuraton({
          "ddei-core-keyaction-all-select": {
            'keys': [
              { keys: "68" },
            ]
          },
        }),
        //某个快捷键的配置
        DDeiKeyActionAllSelect.configuraton({
          'keys': [
            {
              ctrl: 1, keys: "66"
            }
          ]
        }),

        // DDeiCoreBottomMenuPanel,
        DDeiCoreBottomMenuPanel.configuraton({
          'panels': [DDeiCoreSheetsPanel.configuraton({
            max: 10
          }), , DDeiCoreShapeCountPanel.configuraton({
            title: "图形数:"
          }),
            "ddei-core-panel-bottom-managelayers",
          DDeiCoreChangeRatioPanel.configuraton({
            delta: 0.1, min: 1, max: 4, step: 0.2, dialog: true, range: false
          })]
        }),
        DDeiCoreChangeRatioDialog.configuraton({
          dataSource: [
            { text: "200%", value: 2 },
            { text: "150%", value: 1.5 },
            { text: "125%", value: 1.25 },
            { text: "100%", value: 1 },
            { text: "75%", value: 0.75 },
            { text: "50%", value: 0.5 },
          ],
          input: true,
          min: 1, max: 4, title: "缩放比例"
        }),
        // DDeiCoreToolboxPanel.configuraton({
        //   custom: false,
        //   search: false,
        //   // customGroups: [302, 301, 102, 101],
        //   expand: false
        // }),
        DDeiCorePropertyViewPanel.configuraton({

          expand: false
        }),


        //加载UML插件
        DDeiExtUML,

        //加载快捷编辑栏
        DDeiExtQuickStyle
      ],
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
        DDeiCoreStandLayout.configuraton({
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
        ruler:0,
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
        DDeiCoreStandLayout.configuraton({
          //配置插件
          'top': [],
          'middle': ['ddei-core-panel-canvasview'],
          'bottom': [],
          'left': [],
          'right': []
        }),
        DDeiCoreThemeBlack.configuraton({
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
        DDeiCoreStandLayout.configuraton({
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
  <DDeiEditorView ref="editorViewer1" :options="{}" id="ddei_editor_1"></DDeiEditorView>
  <!-- <DDeiEditorView ref="editorViewer2" :options="options1" id="ddei_editor_2"></DDeiEditorView>
  <div style="width:400px;height:400px;float:left">
    <DDeiEditorView ref="editorViewer3" :options="options2" id="ddei_editor_3"></DDeiEditorView>
  </div>

  <div style="width:500px;height:500px;float:left">
    <DDeiEditorView ref="editorViewer4" :options="options3" id="ddei_editor_4"></DDeiEditorView>
  </div>
  <div style="width:400px;height:400px;float:left">
    <DDeiEditorView ref="editorViewer5" :options="options4" id="ddei_editor_5"></DDeiEditorView>
  </div> -->
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