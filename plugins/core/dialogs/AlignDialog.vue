<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-align" v-if="forceRefresh">
    <div class="content">
      <div class="title">对齐</div>
      <div class="group">
        <div class="title">对齐:</div>
        <div class="group_content">
          <div class="item" @click="changeAlign('left')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-left"></use>
            </svg>
          </div>
          <div class="item" @click="changeAlign('center')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-v"></use>
            </svg>
          </div>
          <div class="item" @click="changeAlign('right')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-right"></use>
            </svg>
          </div>
          <div class="item" @click="changeAlign('top')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-top"></use>
            </svg>
          </div>
          <div class="item" @click="changeAlign('middle')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-h"></use>
            </svg>
          </div>
          <div class="item" @click="changeAlign('bottom')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-align-bottom"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="title">等距分布:</div>
        <div class="group_content">
          <div class="item" @click="doAutoPos(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-equ-dist-v"></use>
            </svg>
          </div>
          <div class="item" @click="doAutoPos(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shape-equ-dist-h"></use>
            </svg>
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
  name: "ddei-core-dialog-align",
  extends: null,
  mixins: [DialogBase],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-align',
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
    /**
   * 修改对齐方式
   */
    changeAlign(v) {
      //获取当前选择控件
      let file = this.editor.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelAlign, {
          models: Array.from(stage.selectedModels.values()),
          value: v,
        });
        this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.bus.executeAll();
      }
    },

    /**
    * 自动分布
    */
    doAutoPos(type) {
      //获取当前选择控件
      let file = this.editor.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelAutoPos, {
          models: Array.from(stage.selectedModels.values()),
          value: type,
        });
        this.editor.bus.executeAll();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-align {

  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 180px;
  position: absolute;
  background-color: var(--panel-background);
  height: 180px;
  z-index: 999;

  .content {
    width: 100%;
    max-height: 180px;
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
    }

    .group {
      color: black;
      flex: 1 1 40px;
      width: 100%;
      border-top: 1px solid var(--panel-border);

      .title {
        color: var(--panel-title);
        flex: 0 0 30px;
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        font-size: 15px;
        border: none;
      }

      .group_content {
        width: 100%;
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 3px 0px;

        .item {
          outline: none;
          width: 30px;
          height: 25px;
          margin: auto;
          background: transparent;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;


        }

        .itembox_disabled {
          color: var(--panel-title-disabled);
          text-decoration: line-through;
        }

        .itembox_disabled:hover {
          cursor: not-allowed !important;
        }

        .item:hover {
          background-color: var(--panel-hover);
        }

        .text {
          flex: 1;
          text-align: center;
          white-space: nowrap;
          width: 100%;
        }

        .icon {
          font-size: 28px;
        }

      }
    }
  }
}
</style>
