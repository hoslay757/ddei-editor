<script lang="ts">
import DDeiEditorView from "./editor/Editor.vue";
import { DDeiCoreTopMenuPanel, DDeiCoreThemeBlack, DDeiCoreControls, DDeiCoreHotkeys, DDeiKeyActionAllSelect, DDeiCorePropertyViewPanel, DDeiCoreToolboxPanel, DDeiCoreSheetsPanel, DDeiCoreChangeRatioPanel, DDeiCoreChangeRatioDialog, DDeiCoreShapeCountPanel, DDeiCoreBottomMenuPanel, DDeiCoreStandLayout, DDeiCoreOpenFilesViewPanel } from "@ddei/core";
import { DDeiExtUML } from "@ddei/uml"
import { defineComponent, markRaw } from "vue";
export default defineComponent({
  name: "APP",
  components: { DDeiEditorView },
  setup() {
    const options = markRaw({
      config: {
        
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
        DDeiExtUML
      ],
    })
    const options1 = markRaw({
      config: {

      },
      //配置扩展插件
      extensions: [
        
      ],
    })
    return {
      options,
      options1,
    };
  },
});
</script>


<template>
  <DDeiEditorView ref="editorViewer1" :options="options" id="ddei_editor_1"></DDeiEditorView>
  <DDeiEditorView ref="editorViewer2" :options="options1" id="ddei_editor_2"></DDeiEditorView>
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