<template>
  <div :class="{ 'ddei-pv-editor-fontsize': true, 'ddei-pv-editor-fontsize--disabled': attrDefine.readonly }"
    :style="{ 'pointer-events': attrDefine.readonly ? 'none' : '' }">
    <input type="range" :step="attrDefine.step" class="range" :min="attrDefine.min" :max="attrDefine.max"
      v-model="attrDefine.value" :disabled="attrDefine.readonly" autocomplete="off" />
    <div class="textinput">
      <input type="number" :step="attrDefine.step" :min="attrDefine.min" :max="attrDefine.max"
        v-model="attrDefine.value" :disabled="attrDefine.readonly" :placeholder="attrDefine.defaultValue"
        autocomplete="off" />
      <div style="float:left">px</div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiAbstractArrtibuteParser } from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";

export default {
  name: "pv-font-size",
  extends: null,
  mixins: [],
  props: {
    //当前属性定义
    attrDefine: {
      type: DDeiEditorArrtibute,
      default: null,
    },
    //当前控件定义
    controlDefine: {
      type: Object,
      default: null,
    },
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
    return {}
  },
  computed: {},
  watch: {},
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("attrDefine.value", function (newVal, oldVal) {
      this.valueChange();
    });
  },
  mounted() {
    //判断当前属性是否可编辑
    let mds;
    if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
      mds = Array.from(
        this.editor?.ddInstance?.stage?.selectedModels?.values()
      );
    } else {
      mds = [this.editor?.ddInstance?.stage]
    }
    if (this.attrDefine?.model && mds.indexOf(this.attrDefine.model) == -1) {
      mds.push(this.attrDefine.model);
    }
    let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: mds, propName: this.attrDefine?.code }, this.editor.ddInstance)
    this.attrDefine.readonly = rsState == -1
  },
  methods: {
    valueChange(evt) {
      if (!this.attrDefine?.model) {
        return;
      }
      if (this.attrDefine?.readonly) {
        return;
      }
      let mds = [];
      if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
        mds = Array.from(
          this.editor?.ddInstance?.stage?.selectedModels?.values()
        );
      }
      if (this.attrDefine?.model && mds.indexOf(this.attrDefine.model) == -1) {
        mds.push(this.attrDefine.model);
      }
      if (
        this.editBefore &&
        !this.editBefore(
          DDeiEnumOperateType.EDIT,
          mds,
          this.attrDefine?.code,
          this.editor.ddInstance,
          null
        )
      ) {
        return;
      }
      //获取属性路径
      let paths = [];
      this.attrDefine?.mapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
      }

      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let value = parser.parseValue(this.attrDefine.value);
      value = isNaN(value) || value <= 0 ? null : value
      value = value > 300 ? 300 : value
      let hasEditSetted = false;
      //文本编辑状态
      if (this.editor.ddInstance.stage.render.operateState == DDeiEnumOperateState.QUICK_EDITING) {
        //读取文本的一部分修改其样式
        let shadowControl = this.editor.ddInstance.stage.render.editorShadowControl
        if (shadowControl?.render.isEditoring) {
          let editorText = DDeiUtil.getEditorText();
          //开始光标与结束光标
          let curSIdx = -1
          let curEIdx = -1
          if (editorText) {
            curSIdx = editorText.selectionStart
            curEIdx = editorText.selectionEnd
          }
          if (curSIdx != -1 && curEIdx != -1 && curSIdx <= curSIdx) {
            //增加特殊样式
            shadowControl.setSptStyle(curSIdx, curEIdx, paths, value)
            hasEditSetted = true;
          }
        }
      }
      if (!hasEditSetted) {
        DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, value);
        if (
          this.attrDefine.model.modelType == "DDeiStage" ||
          this.attrDefine.model.modelType == "DDeiLayer"
        ) {
          //推送信息进入总线
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            {
              mids: [this.attrDefine.model.modelType],
              paths: paths,
              value: value,
              attrDefine: this.attrDefine,
            },
            evt,
            true
          );
        } else {
          this.editor.ddInstance.stage.selectedModels.forEach((element) => {
            //推送信息进入总线
            this.editor.bus.push(
              DDeiEnumBusCommandType.ModelChangeValue,
              {
                mids: [element.id],
                paths: paths,
                value: value,
                attrDefine: this.attrDefine,
              },
              evt,
              true
            );
          });
        }
      }
      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
        parts: ["topmenu"],
      });
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
      //编辑完成后的回调函数
      DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_AFTER", DDeiEnumOperateType.EDIT, { models: mds, propName: this.attrDefine?.code }, this.editor.ddInstance, null)
    },
  },
};
</script>

<style scoped>
/**以下为range属性编辑器 */
.ddei-pv-editor-fontsize {
  border-radius: 4px;
  height: 28px;
  margin-right: 10px;
  display: flex;
}

.ddei-pv-editor-fontsize .range {
  height: 7px;
  width: 60%;
  border: transparent;
  outline: none;
  background: transparent;
  flex: 1;
  margin: auto;
}

.ddei-pv-editor-fontsize--disabled .range {
  height: 7px;
  width: 60%;
  border: transparent;
  outline: none;
  background-color: var(--panel-disabled) !important;
  flex: 1;
  margin: auto;
}

.ddei-pv-editor-fontsize .textinput {
  flex: 0 0 80px;
  margin-left: 10px;
  padding-left: 5px;
  padding-right: 5px;
  color:var(--panel-title);
  border: 0.5px solid var(--panel-title);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
}

.ddei-pv-editor-fontsize .textinput:hover {
  border: 1px solid var(--dot);
  box-sizing: border-box;
}

.ddei-pv-editor-fontsize--disabled .textinput {
  flex: 0 0 80px;
  margin-left: 10px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: var(--panel-disabled);
  border: 0.5px solid var(--panel-disabled);
  border-radius: 4px;
  display: flex;
  
}

.ddei-pv-editor-fontsize--disabled .textinput:hover {
  border: 1px solid var(--panel-disabled) !important;
}

.ddei-pv-editor-fontsize .textinput input {
  flex: 1 1 50px;
  border: transparent;
  outline: none;
  font-size: 15px;
  color:var(--panel-title);
  margin: 0px 2%;
  background: transparent;
}
</style>
