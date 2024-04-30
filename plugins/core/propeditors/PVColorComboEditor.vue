<template>
  <div :id="getEditorId(attrDefine?.code)"
    :class="{ 'ddei-pv-color-combox': true, 'ddei-pv-color-combox--disabled': !attrDefine || attrDefine.readonly }">
    <div class="textinput" @click="attrDefine && !attrDefine.readonly && showDialog($event)">
      <input type="color" :readonly="attrDefine && (attrDefine.readonly)" v-model="attrDefine.value"
        autocomplete="off" />
      <div style="display:flex;justify-content: center;align-items: center;">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan466"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
export default {
  name: "pv-color-combo",
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
      //值
      value: null,
    };
  },
  computed: {},
  watch: {},
  created() {
  },

  mounted() {
  },
  methods: {

    getEditorId(id) {
      return "ddei_attr_editor_" + id;
    },

    //打开弹出框
    showDialog(evt) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-selectcolor", {
        value: this.attrDefine.value,
        callback: {
          ok: this.valueChange
        },
        group: "property-dialog"
      }, { type: 5 }, srcElement)
    },

    valueChange(value) {
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
      this.attrDefine.value = value
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
            null,
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
              null,
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
    }

  },
};
</script>

<style lang="less" scoped>
.ddei-pv-color-combox {
  height: 28px;
  padding-right: 10px;
  .textinput {
    width: 100%;
    padding-right: 5px;
    border: 0.5px solid var(--panel-title);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    height: 28px;
    &:hover {
      border: 1px solid var(--dot);
      box-sizing: border-box;
    }
    input {
      flex: 1 1 calc(100% - 10px);
      width: calc(100% - 10px);
      border: transparent;
      outline: none;
      font-size: 15px;
      background: transparent;
      user-select: none;
      pointer-events: none;
    }

    div {
      flex: 0 0 20px;
    }
  }

  &--disabled .textinput {
    background-color: rgb(210, 210, 210);
    height: 28px;
    justify-content: center;
    align-items: center;
  }
}
.icon {
  font-size: 16px
}
</style>
