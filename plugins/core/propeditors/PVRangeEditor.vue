<template>
  <div :class="{ 'ddei-pv-editor-range': true, 'ddei-pv-editor-range--disabled': attrDefine.readonly }">
    <input type="range" :step="attrDefine.step" class="range" :min="attrDefine.min" :max="attrDefine.max"
      v-model="attrDefine.value" :disabled="attrDefine.readonly" />
    <div class="textinput">
      <input type="number" :step="attrDefine.step" :min="attrDefine.min" :max="attrDefine.max"
        v-model="attrDefine.value" :disabled="attrDefine.readonly" :placeholder="attrDefine.defaultValue"
        :name="'ddei-pv-editor-range-' + attrDefine.code" autocomplete="off" />
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from "ddei-framework";
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiAbstractArrtibuteParser } from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import { throttle } from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
export default {
  name: "pv-range",
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
    return {
    };
  },
  computed: {},
  watch: {},
  created() {
    this.valueChange = throttle(this.valueChange, 50);
    // 监听obj对象中prop属性的变化
    this.$watch("attrDefine.value", function (newVal, oldVal) {
      this.valueChange();
    });
  },
  mounted() {
    //判断当前属性是否可编辑
    let mds;
    if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
      mds = Array.from(this.editor?.ddInstance?.stage?.selectedModels?.values());
    }else{
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

<style lang="less" scoped>
/**以下为range属性编辑器 */
.ddei-pv-editor-range {
  border-radius: 4px;
  height: 28px;
  margin-right: 10px;
  display: flex;

  .range {
    height: 7px;
    width: 60%;
    border: transparent;
    outline: none;
    background: transparent;
    flex: 1;
    margin: auto;
  }

  .textinput {
    flex: 0 0 80px;
    margin-left: 10px;
    padding:2px 5px 0px 5px;
    border: 0.5px solid var(--panel-title);
    border-radius: 4px;
    input {
      width: 100%;
      border: transparent;
      outline: none;
      font-size: 15px;
      margin: 0px 2%;
      color:var(--panel-title);
      background: transparent;
    }
    &:hover {
      border: 1px solid var(--dot);
      box-sizing: border-box;
    }
  }

  &--disabled{
    .range {
      height: 7px;
      width: 60%;
      border: transparent;
      outline: none;
      background-color: var(--panel-disabled) !important;
      flex: 1;
      margin: auto;
    }

    .textinput {
      flex: 0 0 80px;
      margin-left: 10px;
      padding-left: 5px;
      padding-right: 5px;
      background-color: var(--panel-disabled);
      border: 0.5px solid var(--panel-disabled);
      border-radius: 4px;

      &:hover {
        border: 1px solid var(--panel-disabled) !important;
        box-sizing: border-box;
      }

      input {
        width: 100%;
        border: transparent;
        outline: none;
        font-size: 15px;
        margin: 0px 2%;
        color: var(--panel-title);
        background: transparent;
      }
    }
  }
}
</style>
