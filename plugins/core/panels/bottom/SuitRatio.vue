<template>
  <div class="ddei-core-panel-bottom-suitratio" v-if="allowStageRatio" @click="autoRatio(1)" title="整页">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-a-ziyuan391"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import stage from "@ddei/core/controls/control/stage";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiModelArrtibuteValue} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: "ddei-core-panel-bottom-suitratio",
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
      allowStageRatio: true,
      currentStage:null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.allowStageRatio = DDeiEditorUtil.getConfigValue(
      "GLOBAL_ALLOW_STAGE_RATIO",
      this.editor
    );
    let file = this.editor?.files[this.editor?.currentFileIndex];
    let sheet = file?.sheets[file?.currentSheetIndex];
    this.currentStage = sheet?.stage;
  },
  methods:{
    /**
     * 自动设置页面模式，
     */
    autoRatio(type: number) {
      //整页模式，确保所有的控件都能够显示到页面上
      if (type == 1) {
        //所有控件的外接大小
        let maxOutRect = DDeiAbstractShape.getOutRectByPV(
          this.editor.ddInstance.stage.getLayerModels()
        );
        if (maxOutRect.width > 0 && maxOutRect.height > 0) {

          //获取canvas窗体大小
          let canvas = this.editor.ddInstance.render.canvas;
          let rat1 = this.editor.ddInstance.render.ratio;
          let stageRatio = this.currentStage.getStageRatio();
          let hscrollWeight = 0;
          let vscrollWeight = 0;
          if (this.editor.ddInstance.stage.render.hScroll) {
            hscrollWeight = 15;
          }
          if (this.editor.ddInstance.stage.render.vScroll) {
            vscrollWeight = 15;
          }
          let ruleDisplay = DDeiModelArrtibuteValue.getAttrValueByState(
            this.editor.ddInstance.stage,
            "ruler.display",
            true
          );
          let ruleWeight = 0;
          if (ruleDisplay == 1 || ruleDisplay == "1") {
            ruleWeight = 16;
          }
          let cWidth = canvas.width / rat1 - ruleWeight - vscrollWeight;
          let cHeight = canvas.height / rat1 - ruleWeight - hscrollWeight;
          //比例
          let wScale = maxOutRect.width * stageRatio / cWidth;
          let hScale = maxOutRect.height * stageRatio / cHeight;
          let scale = wScale;
          if (wScale < hScale) {
            scale = hScale;
          }
          let sc = stageRatio / scale;

          this.setRatio(sc);
          setTimeout(() => {
            this.editor?.bus?.push(DDeiEnumBusCommandType.CenterStageWPV);
            this.editor.changeState(DDeiEditorState.DESIGNING);
            this.editor?.bus?.executeAll(100);
          }, 10);
        }
      }
    },

    /**
     * 设置缩放比率
     */
    setRatio(ratio: number) {
      if (ratio < this.min) {
        ratio = this.min
      } else if (ratio > this.max) {
        ratio = this.max;
      }
      this.currentStage?.setStageRatio(ratio);
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-panel-bottom-suitratio {
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
