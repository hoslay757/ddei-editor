<template>
  <div
    :class="{ 'ddei-pv-editor-switch-excheckbox': true, 'ddei-pv-editor-switch-excheckbox--disabled': attrDefine.readonly }"
    @click="doCheck(attrDefine, $event)" :style="{ 'pointer-events': attrDefine.readonly ? 'none' : '' }">
    <div
      :class="{ 'chk_state': attrDefine.value != 1, 'chk_state_checked': attrDefine.value == 1 || (attrDefine.value == null && attrDefine.defaultValue == 1) }">
      <span>{{ attrDefine.value == 1 || (attrDefine.value == null && attrDefine.defaultValue == 1) ? '✓' : '' }}</span>
    </div>
    <div class="title">{{ editor.i18n(attrDefine.name) }}</div>
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

export default {
  name: "pv-switch-checkbox",
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
  created() { },
  mounted() {
    this.attrDefine.doCascadeDisplayByValue();
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
    doCheck(attrDefine, evt: Event) {
      if (!this.attrDefine?.model) {
        return;
      }
      if (attrDefine?.readonly) {
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
      if (attrDefine.value == null) {
        if (attrDefine.defaultValue == 1) {
          attrDefine.value = 0;
        } else {
          attrDefine.value = 1;
        }
      } else if (!attrDefine.value) {
        attrDefine.value = 1;
      } else {
        attrDefine.value = 0;
      }

      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let value = parser.parseValue(this.attrDefine.value);
      DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, value);
      this.attrDefine.doCascadeDisplayByValue();
      this.editor.ddInstance.stage.selectedModels?.forEach((element) => {
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
      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
        parts: ["topmenu"],
      });
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
      //编辑完成后的回调函数
      //编辑完成后的回调函数
      DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_AFTER", DDeiEnumOperateType.EDIT, { models: mds, propName: this.attrDefine?.code }, this.editor.ddInstance, null)
    },
  },
};
</script>

<style scoped>
/**以下为checkbox属性编辑器 */
.ddei-pv-editor-switch-excheckbox {
  border-radius: 4px;
  margin-right: 10px;
  box-sizing: border-box;
}

.ddei-pv-editor-switch-excheckbox--disabled {
  background-color: var(--panel-disabled) !important;
}

.ddei-pv-editor-switch-excheckbox .title {
  float: left;
  color:var(--panel-title);
}

.ddei-pv-editor-switch-excheckbox .chk_state {
  border: 1px solid var(--panel-title);
  width: 14px;
  height: 14px;
  margin-right: 10px;
  margin-top: 4px;
  float: left;
  box-sizing: border-box;
}

.ddei-pv-editor-switch-excheckbox:hover .chk_state {
  background: var(--dot);
}

.ddei-pv-editor-switch-excheckbox .chk_state_checked {
  border: 1px solid var(--panel-title);
  width: 14px;
  height: 14px;
  margin-right: 10px;
  margin-top: 4px;
  float: left;
  background-color: var(--dot);
  box-sizing: border-box;
  color: #fff;
}

.ddei-pv-editor-switch-excheckbox .chk_state_checked span {
  margin-top: -4.5px;
  margin-left: 0.5px;
  display: block;
}
</style>
