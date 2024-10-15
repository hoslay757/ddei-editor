<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-mergecompose" v-if="forceRefresh">
    <div class="content">
      <div class="title">组合</div>
      <div class="group">
        <div class="group_content">
          <div :class="{ 'item_disabled': !canMerge(), 'item': canMerge() }" @click="canMerge() && doMerge()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-merge"></use>
            </svg>
            <div class="text">组合</div>
          </div>
          <div :class="{ 'item_disabled': !canCancelMerge(), 'item': canCancelMerge() }"
            @click="canCancelMerge() && doCancelMerge()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-cancel-merge"></use>
            </svg>
            <div class="text">取消组合</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-mergecompose",
  extends: null,
  mixins: [DialogBase],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-mergecompose',
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
  },
  methods: {


    //是否可以取消组合
    canCancelMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;

      if (stage?.selectedModels?.size > 0) {
        let models = Array.from(stage?.selectedModels.values())
        if (models[0].baseModelType == 'DDeiContainer' && models[0].layout == "compose") {
          return true;
        }
      }
      return false;
    },
    //是否可以组合
    canMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 1) {
        return true;
      }
      return false;
    },

    /**
   * 执行组合
   */
    doMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 1) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelMerge);
        this.editor.bus.executeAll();
      }
    },

    /**
     * 执行取消组合
     */
    doCancelMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelCancelMerge);
        this.editor.bus.executeAll();

      }
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-mergecompose {
  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 140px;
  position: absolute;
  background-color: var(--panel-background);
  height: 110px;
  z-index: 999;

  .content {
    width: 100%;
    max-height: 110px;
    overflow-y: auto;
    user-select: none;

    .title {
      color: var(--panel-title);
      font-weight: bold;
      flex: 0 0 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 17px;
      border-bottom: 1px solid var(--panel-border);
    }

    .group {
      color: var(--panel-title);
      flex: 1 1 40px;
      width: 100%;

      .group_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .item {
          outline: none;
          font-size: 16px;
          background: transparent;
          border-radius: 4px;
          width: 100%;
          flex: 0 0 36px;
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 0px 10px;
          cursor: pointer;
        }

        .item_disabled {
          outline: none;
          font-size: 16px;
          background: transparent;
          border-radius: 4px;
          width: 100%;
          flex: 0 0 36px;
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 0px 10px;
          color: var(--panel-title-disabled);
          text-decoration: line-through;
        }

        .item_disabled:hover {
          cursor: not-allowed !important;
        }

        .item:hover {
          background-color: var(--panel-hover);
        }

        .text {
          flex: 1;
          text-align: left;
          padding-left: 15px;
          white-space: nowrap;
          width: 100%;
        }

        .icon {
          font-size: 22px;
        }

      }
    }
  }

}
</style>
