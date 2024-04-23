<template>
  <div
    :class="{ 'ddei-pv-editor-switch-excheckbox': true, 'ddei-pv-editor-switch-excheckbox--disabled': attrDefine.readonly }"
    @click="doCheck(attrDefine, $event)" :style="{ 'pointer-events': attrDefine.readonly ? 'none' : '' }">
    <div
      :class="{ 'chk_state': attrDefine.value != 1, 'chk_state_checked': attrDefine.value == 1 || (attrDefine.value == null && attrDefine.defaultValue == 1) }">
      <span>{{ attrDefine.value == 1 || (attrDefine.value == null && attrDefine.defaultValue == 1) ? '✓' : '' }}</span>
    </div>
    <div class="title">{{ attrDefine.name }}</div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework1";
import {DDeiEditor} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiAbstractArrtibuteParser } from "ddei-framework1";
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import {DDeiEnumOperateType} from "ddei-framework1";

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
  },
  data() {
    return {
      //当前编辑器
      editor: null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.attrDefine.doCascadeDisplayByValue();
    //判断当前属性是否可编辑
    this.editBefore = DDeiUtil.getConfigValue(
      "EVENT_CONTROL_EDIT_BEFORE",
      this.editor.ddInstance
    );

    if (
      this.editBefore &&
      this.editor?.ddInstance?.stage?.selectedModels?.size > 0
    ) {
      let mds = [];
      if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
        mds = Array.from(
          this.editor?.ddInstance?.stage?.selectedModels?.values()
        );
      }
      if (this.attrDefine?.model && mds.indexOf(this.attrDefine.model) == -1) {
        mds.push(this.attrDefine.model);
      }
      this.attrDefine.readonly = !this.editBefore(
        DDeiEnumOperateType.EDIT,
        mds,
        this.attrDefine?.code,
        this.editor.ddInstance,
        null
      );
    }
  },
  methods: {
    doCheck(attrDefine, evt: Event) {
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
      if (!this.editAfter) {
        this.editAfter = DDeiUtil.getConfigValue(
          "EVENT_CONTROL_EDIT_AFTER",
          this.editor.ddInstance
        );
      }
      if (this.editAfter) {
        this.editAfter(
          DDeiEnumOperateType.EDIT,
          mds,
          this.attrDefine?.code,
          this.editor.ddInstance,
          null
        );
      }
    },
  },
};
</script>

<style scoped>
/**以下为checkbox属性编辑器 */
.ddei-pv-editor-switch-excheckbox {
  border-radius: 4px;
  margin-right: 10px;
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
  width: 15px;
  height: 15px;
  margin-right: 10px;
  margin-top: 5px;
  float: left;
}

.ddei-pv-editor-switch-excheckbox:hover .chk_state {
  background: var(--dot);
}

.ddei-pv-editor-switch-excheckbox .chk_state_checked {
  border: 1px solid var(--panel-title);
  width: 15px;
  height: 15px;
  margin-right: 10px;
  margin-top: 5px;
  float: left;
  background-color: var(--dot);
  color: #fff;
}

.ddei-pv-editor-switch-excheckbox .chk_state_checked span {
  margin-top: -4.5px;
  margin-left: 1px;
  display: block;
}
</style>
