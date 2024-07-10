<template>
  <div class="ddei-core-panel-bottom-changeratio" v-if="allowStageRatio">

    <div v-if="range"
      :class="{ 'ddei-core-panel-bottom-changeratio__combox': true,'ddei-core-panel-bottom-changeratio__combox__dialog':dialog}"
      @click="dialog && showChangeRatioDialog($event)">
      <span>
        {{ parseInt(currentStage?.ratio * 100) }}%
      </span>
      <svg v-if="dialog" class="icon expbtn" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan466"></use>
      </svg>
    </div>

    <div @click="addRatio(-delta)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan420"></use>
      </svg>
    </div>
    <div v-if="!range"
      :class="{ 'ddei-core-panel-bottom-changeratio__combox': true, 'ddei-core-panel-bottom-changeratio__combox__dialog': dialog }"
      @click="dialog && showChangeRatioDialog($event)">
      <span>
        {{ parseInt(currentStage?.ratio * 100) }}%
      </span>
      <svg v-if="dialog" class="icon expbtn" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan466"></use>
      </svg>
    </div>
    <input v-show="range" type="range" :min="min" :max="max" :step="delta" v-model="stageRatio" autocomplete="off"
      name="ddei-core-panel-bottom-changeratio__range" />
    <div @click="addRatio(delta)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan376"></use>
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: "ddei-core-panel-bottom-changeratio",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    delta: {
      type: Number,
      default: 0.05
    },
    min: {
      type: Number,
      default: 0.1
    },
    max: {
      type: Number,
      default: 4
    },
    dialog: {
      type: Boolean,
      default: true
    },
    range: {
      type: Boolean,
      default: true
    },
    editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      ratioInputValue: 0,
      stageRatio: 1,
      allowStageRatio: true,
      currentStage:null,
    };
  },
  computed: {},
  watch: {},
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("currentStage.ratio", function (newVal, oldVal) {
      if (
        DDeiEditorUtil.getConfigValue("GLOBAL_ALLOW_STAGE_RATIO", this.editor)
      ) {

        if (oldVal && oldVal!= newVal){
          if (!this.changeCurrentStage) {
            this.ratioInputValue = parseFloat(newVal) * 100;
            this.stageRatio = newVal;
            if (!this.tempSheetChange) {
              this.changeRatio();
            } else {
              delete this.tempSheetChange
            }
          } else {
            this.changeCurrentStage = false;
          }
        }
      }
    });
    this.$watch("stageRatio", function (newVal, oldVal) {
      if (
        DDeiEditorUtil.getConfigValue("GLOBAL_ALLOW_STAGE_RATIO", this.editor)
      ) {
        this.setRatio(newVal);
      }
    });
  },
  mounted() {
    this.editor.ddInstance.ratioWatch = true
    let file = this.editor?.files[this.editor?.currentFileIndex];
    let sheet = file?.sheets[file?.currentSheetIndex];
    this.currentStage = sheet?.stage;
    this.allowStageRatio = DDeiEditorUtil.getConfigValue(
      "GLOBAL_ALLOW_STAGE_RATIO",
      this.editor
    );
  },
  methods:{
    showChangeRatioDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-changeratio", {
        ratio: this.currentStage?.ratio,
        min:this.min,
        max:this.max,
        callback: {
          ok: this.setRatio,
        },
        group: "bottom-dialog"
      }, { type: 2 }, srcElement)
      if (DDeiEditor.ACTIVE_INSTANCE.tempDialogData && DDeiEditor.ACTIVE_INSTANCE.tempDialogData["ddei-core-dialog-changeratio"]) {
        this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      } else {
        this.editor.changeState(DDeiEditorState.DESIGNING);
      }

    },

    /**
     * 增加缩放比率
     */
    addRatio(deltaRatio: number) {
      let ratio = this.currentStage?.getStageRatio();
      let newRatio = parseFloat((ratio + deltaRatio).toFixed(2));
      if (newRatio < this.min) {
        newRatio = this.min
      } else if (newRatio > this.max) {
        newRatio = this.max;
      }
      this.currentStage?.setStageRatio(newRatio);
      this.stageRatio = this.currentStage?.ratio;
      this.editor.changeState(DDeiEditorState.DESIGNING);
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
      this.stageRatio = this.currentStage?.ratio;
    },
    /**
     * 修改当前的全局缩放比率
     */
    changeRatio() {
      if (this.currentStage?.ratio || this.currentStage?.ratio == 0) {
        if (this.currentStage?.oldRatio || this.currentStage?.oldRatio == 0) {
          this.editor?.bus?.push(
            DDeiEnumBusCommandType.ChangeStageRatio,
            {
              oldValue: this.currentStage.oldRatio,
              newValue: this.currentStage.ratio,
            },
            null
          );
          this.editor?.bus?.executeAll();
        }
      }
    },
  }
};
</script>

<style lang="less" scoped>
.expbtn {
  width: 14px;
  font-size: 14px;
}
.icon {
  font-size: 22px;
  width:22px;
  height:22px;
}
.ddei-core-panel-bottom-changeratio {
    flex: 0 0 157px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    span {
      float: left;
      margin-left: 5px;
      margin-right: 5px;
    }
  
    div {
      float: left;
      padding-left: 5px;
      padding-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    input {
      float: left;
      width: 100px;
      border-radius: 4px;
    }
  
        &__combox {
          float: left;
          padding-left: 5px;
          padding-right: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
    
          &__dialog {
            &:hover {
              background-color: var(--panel-hover);
              cursor: pointer;
            }
          }
        }

        
  }
</style>
