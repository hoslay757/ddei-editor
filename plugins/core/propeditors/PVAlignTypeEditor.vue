<template>
  <div class="ddei-pv-editor-aligntype">
    <PVBaseCombox :attrDefine="attrDefine" ref="combox" :canSearch="false">
      <div class="ddei-pv-editor-aligntype-items">
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 1 }"
          style="text-align:left" @click="valueChange(1, $event)">
          <div style="vertical-align: top;">左上</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 2 }"
          style="text-align:center" @click="valueChange(2, $event)">
          <div style="vertical-align: top;">中上</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 3 }"
          style="text-align:right" @click="valueChange(3, $event)">
          <div style="vertical-align: top;">右上</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 4 }"
          style="text-align:left" @click="valueChange(4, $event)">
          <div style="vertical-align: middle;">左中</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 5 }"
          style="text-align:center" @click="valueChange(5, $event)">
          <div style="vertical-align: middle;">正中</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 6 }"
          style="text-align:right" @click="valueChange(6, $event)">
          <div style="vertical-align: middle;">右中</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 7 }"
          style="text-align:left" @click="valueChange(7, $event)">
          <div style="vertical-align: bottom;">左下</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 8 }"
          style="text-align:center" @click="valueChange(8, $event)">
          <div style="vertical-align: bottom;">中下</div>
        </div>
        <div :class="{ 'ddei-pv-editor-aligntype-item': true, 'ddei-pv-editor-aligntype-item--selected': value == 9 }"
          style="text-align:right" @click="valueChange(9, $event)">
          <div style="vertical-align: bottom;">右下</div>
        </div>
      </div>
    </PVBaseCombox>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiAbstractArrtibuteParser } from "ddei-framework";
import PVBaseCombox from "./PVBaseCombox.vue";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";

export default {
  name: "pv-align-type",
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
      //临时选择的值
      value: null,
    };
  },
  computed: {},
  components: {
    PVBaseCombox,
  },
  watch: {},
  created() { },
  mounted() {
    let type = this.getTypeValue();
    let text = this.getTypeText(type.value);

    if (!type.isDefault) {
      this.attrDefine.value = type.value;
    }

    this.$refs.combox.text = text;
    this.$refs.combox.value = type.value;
    this.value = type.value;
    //判断当前属性是否可编辑
    if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
      let mds = [];
      if (this.editor?.ddInstance?.stage?.selectedModels?.size > 0) {
        mds = Array.from(
          this.editor?.ddInstance?.stage?.selectedModels?.values()
        );
      }
      if (this.attrDefine?.model && mds.indexOf(this.attrDefine.model) == -1) {
        mds.push(this.attrDefine.model);
      }
      let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: mds, propName: this.attrDefine?.code }, this.editor.ddInstance, null)
      this.attrDefine.readonly = rsState == -1
    }
  },
  methods: {
    getTypeText(type) {
      switch (type) {
        case 1:
          return "左上";
        case 2:
          return "中上";
        case 3:
          return "右上";
        case 4:
          return "左中";
        case 5:
          return "正中";
        case 6:
          return "右中";
        case 7:
          return "右下";
        case 8:
          return "中下";
        case 9:
          return "右下";
      }
    },

    getTypeValue() {
      //通过解析器获取有效值
      let align = DDeiUtil.getDataByPathList(
        this.attrDefine.model,
        "textStyle.align"
      );
      let valign = DDeiUtil.getDataByPathList(
        this.attrDefine.model,
        "textStyle.valign"
      );
      if (align == 1 && valign == 1) {
        return { value: 1 };
      } else if (align == 2 && valign == 1) {
        return { value: 2 };
      } else if (align == 3 && valign == 1) {
        return { value: 3 };
      } else if (align == 1 && valign == 2) {
        return { value: 4 };
      } else if (align == 2 && valign == 2) {
        return { value: 5 };
      } else if (align == 3 && valign == 2) {
        return { value: 6 };
      } else if (align == 1 && valign == 3) {
        return { value: 7 };
      } else if (align == 2 && valign == 3) {
        return { value: 8 };
      } else if (align == 3 && valign == 3) {
        return { value: 9 };
      }
      return { isDefault: true, value: 5 };
    },

    valueChange(type, evt) {
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
      let align = 2;
      let valign = 2;
      switch (type) {
        case 1:
          align = 1;
          valign = 1;
          break;
        case 2:
          align = 2;
          valign = 1;
          break;
        case 3:
          align = 3;
          valign = 1;
          break;
        case 4:
          align = 1;
          valign = 2;
          break;
        case 5:
          align = 2;
          valign = 2;
          break;
        case 6:
          align = 3;
          valign = 2;
          break;
        case 7:
          align = 1;
          valign = 3;
          break;
        case 8:
          align = 2;
          valign = 3;
          break;
        case 9:
          align = 3;
          valign = 3;
          break;
      }
      this.attrDefine.value = type;
      let text = this.getTypeText(type);
      this.$refs.combox.text = text;
      this.$refs.combox.value = type;
      this.value = type;
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
      let alignValue = parser.parseValue(align);
      let valignValue = parser.parseValue(valign);
      DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, this.value);
      this.attrDefine.doCascadeDisplayByValue();
      this.editor.ddInstance.stage.selectedModels.forEach((element) => {
        //推送信息进入总线
        this.editor.bus.push(
          DDeiEnumBusCommandType.ModelChangeValue,
          {
            mids: [element.id],
            paths: paths,
            value: this.value,
            attrDefine: this.attrDefine,
          },
          evt,
          true
        );
        DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, this.value);

        //推送信息进入总线
        this.editor.bus.push(
          DDeiEnumBusCommandType.ModelChangeValue,
          {
            mids: [element.id],
            paths: ["textStyle.align"],
            value: alignValue,
            attrDefine: this.attrDefine,
          },
          evt,
          true
        );
        this.editor.bus.push(
          DDeiEnumBusCommandType.ModelChangeValue,
          {
            mids: [element.id],
            paths: ["textStyle.valign"],
            value: valignValue,
            attrDefine: this.attrDefine,
          },
          evt,
          true
        );
        //根据code以及mapping设置属性值
        DDeiUtil.setAttrValueByPath(
          this.attrDefine.model,
          ["textStyle.align"],
          alignValue
        );
        //根据code以及mapping设置属性值
        DDeiUtil.setAttrValueByPath(
          this.attrDefine.model,
          ["textStyle.valign"],
          valignValue
        );
      });
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
/**以下为aligntype属性编辑器 */
.ddei-pv-editor-aligntype {
  &-items {
    width: 200px;
    height: 150px;
    display: grid;
    padding: 2%;
    grid-template-rows: 30% 30% 30%;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4px;

  }

  &-item {
    text-align: center;
    font-size: 16px;
    display: table;
    color: var(--panel-title);
    border: 0.5px solid var(--panel-title);
    background-color: var(--panel-background);
    padding: 5px;

    div {
      display: table-cell;
    }

    &:hover {
      border: 1px solid var(-dot);
      cursor: pointer;
    }

    &--selected {
      border: 1px solid var(-dot);
    }
  }

}

</style>
