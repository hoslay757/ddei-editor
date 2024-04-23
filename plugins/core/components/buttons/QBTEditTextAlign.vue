<template>
  <div
    :class="{ 'ddei-editor-quick-fat-item-box': true, 'ddei-editor-quick-fat-item-box--disabled': !(attrDefine || valignAttrDefine) }"
    @click="(attrDefine || valignAttrDefine) && showTextAlignDialog($event)">
    <svg :class="'icon ' + (extcls ? extcls : '')" aria-hidden="true">
      <use :xlink:href="'#' + img"></use>
    </svg>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";

export default {
  name: "ddei-core-btn-textalign",
  extends: null,
  mixins: [],
  components: {},
  props: {

    img: {
      type: String,
      default: null,
    },
    extcls: {
      type: String,
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
      controlDefine: null,
      attrDefine: null,
      valignAttrDefine: null,
      value: false,
    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.refreshEditor();
  },
  methods: {

    showTextAlignDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog("ddei-core-dialog-textalign", {
        group: "top-dialog",
        align: this.attrDefine.value,
        valign: this.valignAttrDefine.value,
        callback: {
          ok: this.valueChange
        }
      }, { type: 5 }, srcElement, false, true)
    },

    refreshEditor() {
      if (this.editor?.currentControlDefine) {
        this.controlDefine = this.editor.currentControlDefine;
        if (this.controlDefine) {
          this.attrDefine = this.controlDefine.attrDefineMap.get(
            "textStyle.align"
          );
          this.valignAttrDefine = this.controlDefine.attrDefineMap.get(
            "textStyle.valign"
          );

        } else {
          this.attrDefine = null;
          this.valignAttrDefine = null;
        }
      }
    },


    valueChange(value = 5) {

      switch (value) {
        case 1:
          this.attrDefine.value = 1
          this.valignAttrDefine.value = 1
          break;
        case 2:
          this.attrDefine.value = 2
          this.valignAttrDefine.value = 1
          break;
        case 3:
          this.attrDefine.value = 3
          this.valignAttrDefine.value = 1
          break;
        case 4:
          this.attrDefine.value = 1
          this.valignAttrDefine.value = 2
          break;
        case 5:
          this.attrDefine.value = 2
          this.valignAttrDefine.value = 2
          break;
        case 6:
          this.attrDefine.value = 3
          this.valignAttrDefine.value = 2
          break;
        case 7:
          this.attrDefine.value = 1
          this.valignAttrDefine.value = 3
          break;
        case 8:
          this.attrDefine.value = 2
          this.valignAttrDefine.value = 3
          break;
        case 9:
          this.attrDefine.value = 3
          this.valignAttrDefine.value = 3
          break;
      }

      this.editor.ddInstance.stage.selectedModels.forEach((element) => {
        let paths = [];
        this.attrDefine?.mapping?.forEach((element) => {
          paths.push(element);
        });
        if (!(paths?.length > 0)) {
          paths = [this.attrDefine.code];
        }
        let paths1 = [];
        this.valignAttrDefine?.mapping?.forEach((element) => {
          paths1.push(element);
        });
        if (!(paths1?.length > 0)) {
          paths1 = [this.valignAttrDefine.code];
        }
        this.editor.bus.push(
          DDeiEnumBusCommandType.ModelChangeValue,
          { mids: [element.id], paths: paths, value: this.attrDefine.value },
          null,
          true
        );
        this.editor.bus.push(
          DDeiEnumBusCommandType.ModelChangeValue,
          { mids: [element.id], paths: paths1, value: this.valignAttrDefine.value },
          null,
          true
        );
      });

      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
        parts: ["topmenu"],
      });
      this.editor.bus.executeAll();
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-editor-quick-fat-item-box {
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: var(--panel-hover);
  }

  &--selected {
    background-color: var(--panel-selected);
  }

  &--disabled {
    pointer-events: none;
    color: var(--panel-title-selected);
    cursor: not-allowed;
    background-color: var(--panel-selected);
  }
  
  .rotate-90 {
    transform: rotate(90deg);
  }

  .ext-underline {
    margin-top: 5.5px;
    font-size: 16px;
  }

  .magtop-1 {
    margin-top: -1px;
  }

  .magtop-2 {
    margin-top: -2px;
  }

  .magtop-3 {
    margin-top: -3px;
  }
}



</style>
