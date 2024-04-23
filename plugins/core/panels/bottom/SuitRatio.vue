<template>
  <div class="ddei-core-panel-bottom-suitratio" v-if="allowStageRatio" @click="autoRatio(1)" title="整页">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-a-ziyuan391"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import {DDeiAbstractShape} from "ddei-framework1";
import {DDeiModelArrtibuteValue} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEditorState} from "ddei-framework1";

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
  },
  data() {
    return {
      editor: null,
      allowStageRatio: true,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.allowStageRatio = DDeiEditorUtil.getConfigValue(
      "GLOBAL_ALLOW_STAGE_RATIO",
      this.editor
    );
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
          let wScale = maxOutRect.width / cWidth;
          let hScale = maxOutRect.height / cHeight;
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
