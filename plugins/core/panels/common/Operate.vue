<template>
  <div class="ddei-core-panel-operate">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div
          :class="{ 'button-v--selected': editor?.ddInstance?.stage?.copyMode == 'cut', 'button-v': editor?.ddInstance?.stage?.selectedModels?.size > 0, 'button-v--disabled': !canEdit || editor?.ddInstance?.stage?.selectedModels?.size == 0 || !editor?.ddInstance?.stage?.selectedModels }"
          :title="editor.i18n('ddei.cut')"
          @click="canEdit && editor?.ddInstance?.stage?.selectedModels?.size > 0 && execShearAction($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-cut"></use>
          </svg>
          <div class="text">{{editor.i18n('ddei.cut')}}</div>
        </div>
      </div>

      <div class="part">
        <div
          :class="{ 'button-v--selected': editor?.ddInstance?.stage?.copyMode == 'copy', 'button-v': editor?.ddInstance?.stage?.selectedModels?.size > 0, 'button-v--disabled': editor?.ddInstance?.stage?.selectedModels?.size == 0 || !editor?.ddInstance?.stage?.selectedModels }"
          :title="editor.i18n('ddei.new')"
          @click="editor?.ddInstance?.stage?.selectedModels?.size > 0 && execCopyAction($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-copy-file"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.copy') }}</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v': hasClipData, 'button-v--disabled': !canEdit || !hasClipData }"
          :title="editor.i18n('ddei.paste') ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-paste"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.paste') }}</div>
        </div>
      </div>
      <div class="part">
        <div
          :class="{ 'button-v--selected': canEdit && editor?.ddInstance?.stage?.brushData, 'button-v': canEdit && displayBrush, 'button-v--disabled': !canEdit || !displayBrush }"
          :title="editor.i18n('ddei.brush') "
          @click="canEdit && editor?.ddInstance?.stage?.selectedModels?.size == 1 && execBrushAction($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-brush"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.brush') }}</div>
        </div>
      </div>
    </div>
    <div class="tail">
      {{editor.i18n('ddei.cutBoard')}}
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiConfig} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import { DDeiEditor, DDeiEnumOperateType } from "ddei-framework";


export default {
  name: "ddei-core-panel-operate",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      hasClipData: false,
      displayBrush: false,
      canEdit:true
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    let mds = []
    if (this.editor.ddInstance.stage.selectedModels?.size > 0) {
      mds = Array.from(this.editor.ddInstance.stage.selectedModels.values())
    }
    let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: mds }, this.editor.ddInstance)
    if (rsState == -1) {
      this.canEdit = false
    }
    this.hasClipboard();
    this.isDisplayBrush();
  },
  methods: {
    /**
     * 执行剪切
     */
    execShearAction(evt: Event) {
      this.editor?.hotkeys['ddei-core-keyaction-cut']?.action(evt, this.editor.ddInstance, this.editor);
    },

    /**
     * 执行复制
     */
    execCopyAction(evt: Event) {
      this.editor?.hotkeys['ddei-core-keyaction-copy']?.action(evt, this.editor.ddInstance, this.editor);
    },

    /**
     * 执行格式刷
     */
    execBrushAction(evt: Event) {
      this.editor?.hotkeys['ddei-core-keyaction-brush-data']?.action(evt, this.editor.ddInstance, this.editor);
    },

    /**
     * 判定是否显示格式刷
     */
    isDisplayBrush() {
      this.displayBrush = false;
      if (this.editor?.ddInstance?.stage?.selectedModels?.size == 1) {
        let model = Array.from(
          this.editor?.ddInstance?.stage?.selectedModels?.values()
        )[0];
        if (model.baseModelType == "DDeiTable") {
          let selectedCells = model.getSelectedCells();
          if (selectedCells?.length > 0) {
            this.displayBrush = true;
          }
        } else {
          this.displayBrush = true;
        }
      }
    },
    /**
     * 检查剪切板中是否有内容
     */
    async hasClipboard() {
      this.hasClipData = false;
      if (this.editor?.ddInstance?.stage?.copyMode) {
        this.hasClipData = true;
      } else {
        let hasFocus = document.hasFocus();
        if (hasFocus) {
          try {
            // 判断是否Safari浏览器
            if (!DDeiUtil.isSafari()) {
              if (DDeiConfig.ALLOW_CLIPBOARD) {
                let items = await navigator.clipboard.read();
                if (items?.length > 0) {
                  this.hasClipData = true;
                }
              }
            }
          } catch (e) { }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-operate {
  height: 103px;
  width:230px;
  flex:0 1 230px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;
  text-align: center;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
    padding: 0px 4px;

    .part {
      padding: 0px 2px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .button-v {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 50px;
        border-radius: 4px;
        align-items: center;

        &:hover {
          cursor: pointer;
          background-color: var(--panel-hover);
        }
      }


      .button-v--selected {
        flex: 1;
        height: 50px;
        display: flex;
        flex-direction: column;
        background-color: var(--panel-selected);
        border-radius: 4px;
        .text{
          color:var(--panel-title-selected);
        }
      }

      .button-v--disabled {
        flex: 1;
        height: 50px;
        display: flex;
        flex-direction: column;
        cursor: not-allowed;
        align-items: center;
        background-color: var(--panel-disabled);

        .icon {
          filter: grayscale(1);
          opacity: 40%;
        }

        .text {
          color: var(--panel-title-disabled);
        }
      }

      .text {
        font-size: 14px;
        white-space: nowrap;
        font-weight: 400;
        color: var(--panel-title);
      }
    }
  }

  .tail {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--panel-title); // fade(var(--panel-title), 40%);
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
