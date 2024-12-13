<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-changerotate" v-if="forceRefresh">
    <div class="content">
      <div class="title">{{ editor.i18n('ddei.flip') }}</div>
      <div class="group">
        <div class="title">{{ editor.i18n('ddei.mirror') }}:</div>
        <div class="group_content">
          <div :class="{ 'item': canMirror(), 'item_disabled': !canMirror() }" @click="canMirror() && doMirror(1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-mirror-v"></use>
            </svg>
          </div>
          <div :class="{ 'item': canMirror(), 'item_disabled': !canMirror() }" @click="canMirror() && doMirror(2)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-mirror-h"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="title">{{ editor.i18n('ddei.rotate') }}:</div>
        <div class="group_content">
          <div :class="{ 'item': canRotate(), 'item_disabled': !canRotate() }" @click="canRotate() && doRotate(90)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-rotate-90"></use>
            </svg>
          </div>
          <div :class="{ 'item': canRotate(), 'item_disabled': !canRotate() }" @click="canRotate() && doRotate(-90)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-rotate-270"></use>
            </svg>
          </div>
          <div :class="{ 'item': canRotate(), 'item_disabled': !canRotate() }" @click="canRotate() && doRotate(-1)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-rotate-0"></use>
            </svg>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { DDeiEditor, DDei, DDeiEnumOperateType } from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiConfig} from "ddei-framework";
import { Matrix3 } from 'ddei-framework';
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-changerotate",
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
      dialogId: 'ddei-core-dialog-changerotate',
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    
  },
  methods: {

    //是否可以镜像
    canMirror() {
      let models = null;
      if (this.editor.ddInstance.stage?.selectedModels?.size > 0) {
        models = Array.from(this.editor.ddInstance.stage?.selectedModels.values())
      }
      let canMirror = DDei.beforeOperateValid(DDeiEnumOperateType.MIRROR, { models: models }, this.editor.ddInstance, null);
      if (!(canMirror == 0 || canMirror == 1)) {
        return true
      } else {
        return false
      }
    },

    canRotate() {
      let models = null;
      if (this.editor.ddInstance.stage?.selectedModels?.size > 0) {
        models = Array.from(this.editor.ddInstance.stage?.selectedModels.values())
      }
      let canRotate = DDei.beforeOperateValid(DDeiEnumOperateType.ROTATE, { models: models }, this.editor.ddInstance, null);
      if (!(canRotate == 0 || canRotate == 1)) {
        return true
      }else{
        return false
      }
    },






    doRotate(rotate) {
      let file = this.editor.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        stage.selectedModels.forEach((model) => {
          let oldRotate = model.rotate ? model.rotate : 0;
          let newRotate = (oldRotate ? oldRotate : 0) + rotate;
          if (rotate == -1) {
            newRotate = 0;
          }
          if (oldRotate != newRotate) {
            let m1 = new Matrix3()
            let move1Matrix = new Matrix3(
              1, 0, -model.cpv.x,
              0, 1, -model.cpv.y,
              0, 0, 1);
            m1.premultiply(move1Matrix)
            if (oldRotate) {
              let angle = (oldRotate * DDeiConfig.ROTATE_UNIT).toFixed(4);
              let rotateMatrix = new Matrix3(
                Math.cos(angle), Math.sin(angle), 0,
                -Math.sin(angle), Math.cos(angle), 0,
                0, 0, 1);
              m1.premultiply(rotateMatrix)
            }

            if (newRotate != 0) {
              let angle1 = (-newRotate * DDeiConfig.ROTATE_UNIT).toFixed(4);
              let rotate1Matrix = new Matrix3(
                Math.cos(angle1), Math.sin(angle1), 0,
                -Math.sin(angle1), Math.cos(angle1), 0,
                0, 0, 1);
              m1.premultiply(rotate1Matrix)
            }
            let move2Matrix = new Matrix3(
              1, 0, model.cpv.x,
              0, 1, model.cpv.y,
              0, 0, 1);
            m1.premultiply(move2Matrix)
            model.transVectors(m1)
          }
          model.render?.enableRefreshShape();
        });
        this.editor.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds);
        this.editor.bus.push(DDeiEnumBusCommandType.NodifyChange);
        this.editor.bus.push(DDeiEnumBusCommandType.AddHistroy);
        this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.bus.executeAll();
      }
    },

    doMirror(mirrorType) {
      let file = this.editor.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        stage.selectedModels.forEach((model) => {
          if (mirrorType == 1){
            if (!model.mirrorX){
              model.mirrorX = true
            }else{
              delete model.mirrorX
            }
          }else if(mirrorType == 2){
            if (!model.mirrorY) {
              model.mirrorY = true
            } else {
              delete model.mirrorY
            }
          }
          
          model.render?.enableRefreshShape();
        });
        this.editor.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds);
        this.editor.bus.push(DDeiEnumBusCommandType.NodifyChange);
        this.editor.bus.push(DDeiEnumBusCommandType.AddHistroy);
        this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.bus.executeAll();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-changerotate {

  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 180px;
  position: absolute;
  background-color: var(--panel-background);
  height: 150px;
  z-index: 999;

  .content {
    width: 100%;
    max-height: 150px;
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
      color: var(--panel-title);
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

        .item_disabled {
          color: var(--panel-title-disabled);
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
          text-decoration: line-through;

          .icon {
            color: var(--panel-title-disabled);
          }
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
          font-size: 28px;
        }

      }
    }
  }
}
</style>
