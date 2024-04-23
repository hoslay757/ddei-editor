<template>
  <div :class="{ 'ddei-editor-quickifat-item-box': true, 'ddei-editor-quickifat-item-box--disabled': !attrDefine }"
    @click="attrDefine && valueChange($event)">
    <svg :class="'icon ' + (extcls ? extcls : '')" aria-hidden="true">
      <use :xlink:href="'#' + img"></use>
    </svg>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from 'ddei-framework1';
import {DDeiUtil} from 'ddei-framework1';
import {DDeiEnumBusCommandType} from 'ddei-framework1';
import {DDeiEnumOperateState} from 'ddei-framework1';
import {DDeiModelArrtibuteValue} from 'ddei-framework1';
import {DDeiEditorEnumBusCommandType} from 'ddei-framework1';
import {DDeiEditorState} from 'ddei-framework1';

export default {
  name: "ddei-core-btn-addfontsize",
  extends: null,
  mixins: [],
  components: {
  },
  props: {
    attrCode: {
      type: String,
      default: null
    },
    addValue: {
      type: Number,
      default: null
    },
    img: {
      type: String,
      default: null
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
      value: 0
    };
  },
  computed: {},
  watch: {

  },
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("editor.textEditorSelectedChange", function (newVal, oldVal) {
      if (newVal) {
        this.refreshEditor();
      }
    });
  },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.refreshEditor()
  },
  methods: {

    refreshEditor() {
      this.value = 0;
      if (this.editor?.currentControlDefine) {
        this.controlDefine = this.editor.currentControlDefine;
        if (this.controlDefine) {
          this.attrDefine = this.controlDefine.attrDefineMap.get(this.attrCode);
          let valueDefine = this.getDataValue();

          if (valueDefine) {
            this.value = valueDefine.value;
          }
        } else {
          this.attrDefine = null
        }
      }
    },

    //获取数据值
    getDataValue() {
      if (this.attrDefine) {
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
            //获取光标范围内的特殊样式，如果有且相同，则返回值，否则不返回值
            if (curSIdx != -1 && curEIdx != -1 && curSIdx <= curSIdx) {
              //增加特殊样式
              //获取属性路径
              let paths = [];
              this.attrDefine?.mapping?.forEach((element) => {
                paths.push(element);
              });
              if (!(paths?.length > 0)) {
                paths = [this.attrDefine.code];
              }
              let value = shadowControl.getSptStyle(curSIdx, curEIdx, paths)
              if (value === undefined) {
                value = DDeiModelArrtibuteValue.getAttrValueByState(shadowControl, paths[0], true);
              }
              return { value: value };
            }
          }
        }
        let dataValue = this.attrDefine.value;
        if (!dataValue) {
          dataValue = DDeiUtil.getDataByPathList(this.attrDefine.model, this.attrDefine.code, this.attrDefine.mapping);
        }
        if (dataValue) {
          return { value: dataValue }
        }
      }
      //通过解析器获取有效值
      return { isDefault: true, value: this.attrDefine?.getParser().getDefaultValue() };
    },


    valueChange(evt) {
      let value = this.value + this.addValue;
      this.value = value;
      this.attrDefine.value = value;
      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let parsedValue = parser.parseValue(value);
      //获取属性路径
      let paths = [];
      this.attrDefine?.mapping?.forEach(element => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code]
      }
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
            shadowControl.setSptStyle(curSIdx, curEIdx, paths, parsedValue)
            this.editor.bus.push(DDeiEnumBusCommandType.TextEditorChangeSelectPos);
            setTimeout(() => {
              editorText.focus();
            }, 20);
            hasEditSetted = true;
          }
        }
      }
      if (!hasEditSetted) {
        this.editor.ddInstance.stage.selectedModels.forEach(element => {
          this.editor.bus.push(DDeiEnumBusCommandType.ModelChangeValue, { mids: [element.id], paths: paths, value: parsedValue }, evt, true);
        });
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
        parts: ["topmenu"],
      });
      this.editor.bus.executeAll();
      if (this.editor.state != DDeiEditorState.QUICK_EDITING) {
        this.editor.changeState(DDeiEditorState.DESIGNING);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-editor-quickifat-item-box {
  width: 22px;
  display: flex;
  text-align: center;

  &--disabled {
    pointer-events: none;
    color: var(--panel-title-disabled);
    background:var(--panel-disabled);
    cursor: not-allowed;
  }

  &:hover {
    cursor: pointer;
    background-color: var(--panel-hover);
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
