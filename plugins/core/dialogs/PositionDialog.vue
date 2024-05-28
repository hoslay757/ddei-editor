<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-changeposition" v-if="forceRefresh">
    <div class="content">
      <div class="title">位置</div>
      <div class="group">
        <div class="group_content">
          <div :class="{ 'item_disabled': !canPush('top'), 'item': canPush('top') }"
            @click="canPush('top') && doPush('top')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan435"></use>
            </svg>
            <div class="text">置于顶层</div>
          </div>
          <div :class="{ 'item_disabled': !canPush('bottom'), 'item': canPush('bottom') }"
            @click="canPush('top') && doPush('bottom')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan436"></use>
            </svg>
            <div class="text">置于底层</div>
          </div>
          <div :class="{ 'item_disabled': !canPush('up'), 'item': canPush('up') }"
            @click="canPush('up') && doPush('up')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan433"></use>
            </svg>
            <div class="text">上移一层</div>
          </div>
          <div :class="{ 'item_disabled': !canPush('down'), 'item': canPush('down') }"
            @click="canPush('down') && doPush('down')">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan434"></use>
            </svg>
            <div class="text">下移一层</div>
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
  name: "ddei-core-dialog-changeposition",
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
      dialogId: 'ddei-core-dialog-changeposition',
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    //是否置于上层
    canPush(type) {
      return true;
    },

    //修改图形层次
    doPush(v) {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      let stageRender = stage?.render;
      let optContainer = stageRender?.currentOperateContainer;
      if (optContainer) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelPush, {
          container: optContainer,
          type: v,
        });
        //渲染图形
        this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.bus.executeAll();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-changeposition {

  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 140px;
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
          margin: auto;
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
          text-align: center;
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
