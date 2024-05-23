<template>
  <div class="ddei-core-panel-sort">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div
          :class="{ 'button-v--disabled': !canEdit || !isButtonEnable(), 'button-v--selected': canEdit && isButtonEnable() && dialogShow == 'ddei-core-panel-sort-ddei-core-dialog-changeposition', 'button-v': canEdit && isButtonEnable() }"
          @click="canEdit && isButtonEnable() && showPositionDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan429"></use>
          </svg>
          <div class="text">位置</div>
          <svg class="icon extbtn" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan466"></use>
          </svg>
        </div>
      </div>
      <div class="part">
        <div
          :class="{ 'button-v--disabled': !canEdit || !isButtonEnable(2), 'button-v--selected': canEdit && isButtonEnable(2) && dialogShow == 'ddei-core-panel-sort-align-dialog', 'button-v': canEdit && isButtonEnable(2) }"
          @click="canEdit && isButtonEnable(2) && showAlignDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan428"></use>
          </svg>
          <div class="text">对齐</div>
          <svg class="icon extbtn" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan466"></use>
          </svg>
        </div>
      </div>
      <div class="part">
        <div
          :class="{ 'button-v--disabled': !canEdit || !isButtonEnable(), 'button-v--selected': canEdit && isButtonEnable() && dialogShow == 'ddei-core-panel-sort-merge-dialog', 'button-v': canEdit && isButtonEnable() }"
          @click="canEdit && isButtonEnable() && showMergeDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan427"></use>
          </svg>
          <div class="text">组合</div>
          <svg class="icon extbtn" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan466"></use>
          </svg>
        </div>
      </div>

      <div class="part">
        <div
          :class="{ 'button-v--disabled': !canEdit || !isButtonEnable(), 'button-v--selected': canEdit && isButtonEnable() && dialogShow == 'ddei-core-panel-sort-ddei-core-dialog-changerotate', 'button-v': canEdit && isButtonEnable() }"
          @click="canEdit && isButtonEnable() && showRotateDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan426"></use>
          </svg>
          <div class="text">翻转</div>
          <svg class="icon extbtn" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan466"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="tail">排列</div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import { DDeiEditorUtil, DDeiEnumOperateType ,DDeiUtil} from "ddei-framework";
export default {
  name: "ddei-core-panel-sort",
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
      dialogShow: "",
      canEdit: true
    };
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
     * 显示弹出框
     */
    showPositionDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-changeposition", {
        group: "top-dialog"
      }, { type: 5 }, srcElement)

    },
    showAlignDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor,'ddei-core-dialog-align', {
        group: "top-dialog"
      }, { type: 5 }, srcElement)
    },
    showMergeDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor,"ddei-core-dialog-mergecompose", {
        group: "top-dialog"
      }, { type: 5 }, srcElement)
    },
    showRotateDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor,"ddei-core-dialog-changerotate", {
        group: "top-dialog"
      }, { type: 5 }, srcElement)
    },

    /**
     * 对齐按钮是否显示
     */
    isButtonEnable(num: number = 1) {
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size >= num) {
        return true;
      }
      return false;
    },

  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-sort {
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
    padding: 0px 4px;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

    .part {
      flex: 1;
      padding: 0px 2px;
      display: flex;
      justify-content: center;
      align-items: center;

      .button-v {
        flex: 1;
        height: 50px;
        border-radius: 4px;
      }

      .button-v:hover {
        cursor: pointer;
        background-color: var(--panel-hover);
      }

      .button-v--selected {
        flex: 1;
        height: 50px;
        background-color: var(--panel-selected);
        border-radius: 4px;
        .text {
          color: var(--panel-title-selected);
        }
      }

      .button-v--disabled {
        flex: 1;
        height: 50px;
        cursor: not-allowed;
        background-color: var(--panel-disabled);
        >span {
          color: var(--panel-title-disabled);
        }

        .icon {
          filter: grayscale(1);
          opacity: 40%;
        }

        .text {
          color: var(--panel-title-disabled);
        }
      }

      .text {
        height: 20px;
        font-size: 14px;
        white-space: nowrap;
        font-weight: 400;
        color: var(--panel-title);
        margin-top: -3px;
      }

      .extbtn {
        font-size: 12px;
        vertical-align: top;
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
