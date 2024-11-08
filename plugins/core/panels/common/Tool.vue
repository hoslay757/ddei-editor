<template>
  <div class="ddei-core-panel-tool">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div :class="{ 'button-v--selected': editor?.editMode == 1, 'button-v': editor?.editMode != 1 }"
          :title="editor.i18n('ddei.choose') " @click="changeEditMode(1)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-selector"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.choose') }}</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v--selected': editor?.editMode == 2, 'button-v': editor?.editMode != 2 }"
          :title="editor.i18n('ddei.moveStage') " @click="changeEditMode(2)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-hand"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.moveStage') }}</div>
        </div>
      </div>
      <div class="part">
        <div
          :class="{ 'button-v--selected': canEdit && editor?.editMode == 4, 'button-v': canEdit && editor?.editMode != 4, 'button-v--disabled': !canEdit }"
          :title="editor.i18n('ddei.linkLine')" @click="canEdit && changeEditMode(4)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-link-line"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.linkLine') }}</div>
        </div>
      </div>
    </div>
    <div class="tail">
      {{ editor.i18n('ddei.tools') }}
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import { DDeiEditorState, DDeiEnumOperateType, DDeiUtil } from "ddei-framework";
export default {
  name: "ddei-core-panel-tool",
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
      canEdit:true
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    let mds = [this.editor.currentStage]
    if (this.editor.ddInstance.stage.selectedModels?.size > 0) {
      mds = Array.from(this.editor.ddInstance.stage.selectedModels.values())
    }

    let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: mds }, this.editor.ddInstance)
    if (rsState == -1) {
      this.canEdit = false
    }
  },
  methods: {
    /**
     * 修改当前编辑器的编辑模式
     */
    changeEditMode(mode) {
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ChangeEditMode, {
        mode: mode,
      });
      this.editor.bus.executeAll();
      this.editor.changeState(DDeiEditorState.DESIGNING);
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-tool {
  height: 103px;
  width:200px;
  flex:0 1 200px;
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
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0px 2px;

      .button-v {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 50px;
        border-radius: 4px;
        align-items: center;
      }

      .button-v:hover {
        cursor: pointer;
        background-color: var(--panel-hover);
      }

      .button-v--selected {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 50px;
        background-color: var(--panel-selected);
        border-radius: 4px;
        align-items: center;
        .text {
          color: var(--panel-title-selected);
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
        flex: 0 0 13px;
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
    color:var(--panel-title); // var(--panel-title); // fade(var(--panel-title), 40%);
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
