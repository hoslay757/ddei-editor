<template>
  <div
    :class="{ 'ddei-pv-border-dash-combox': true, 'ddei-pv-border-dash-combox--disabled': !attrDefine || attrDefine.readonly }">
    <div class="textinput" @click="attrDefine && !attrDefine.readonly && showDialog($event)">
      <svg class="div_input">
        <line x1=0 y1=0 x2="100%" y2=0 stroke="black" fill="white" stroke-width="3"
          :stroke-dasharray="attrDefine?.value">
        </line>
      </svg>
      <div v-if="hiddenCombo != '1'" style="display:flex;justify-content: center;align-items: center;">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan466"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from 'ddei-framework';
import {DDeiUtil} from 'ddei-framework';
import {DDeiEnumBusCommandType} from 'ddei-framework';
import {DDeiEnumOperateState} from 'ddei-framework';
import {DDeiModelArrtibuteValue} from 'ddei-framework';
import {DDeiEditorUtil} from 'ddei-framework';
export default {
  name: "ddei-core-btn-borderdash",
  extends: null,
  mixins: [],
  components: {
  },
  props: {
    attrCode: {
      type: String,
      default: null
    },

    hiddenCombo: {
      type: String,
      default: '0'
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
    , editor: {
      type: DDeiEditor,
      default: null,
    },
    controlDefine: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      attrDefine: null,
      value: null
    };
  },
  computed: {},
  watch: {

  },
  created() {

  },
  mounted() {
    this.refreshEditor();
  },
  methods: {
    refreshEditor() {
      if (this.controlDefine) {
        this.attrDefine = this.controlDefine.attrDefineMap.get(this.attrCode);
        let valueDefine = this.getDataValue();
        if (valueDefine && !valueDefine.isDefault) {
          this.value = valueDefine.value;
        }
      } else {
        this.attrDefine = null
      }
      
    },

    //打开弹出框
    showDialog(evt) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor,"ddei-core-dialog-selectborderdash", {

        value: this.attrDefine.value,
        dataSource: this.attrDefine.dataSource,
        callback: {
          ok: this.valueChange
        },
        group: "property-dialog"
      }, { type: 5 }, srcElement, false, true)
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
              //获取特殊样式
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


    valueChange(value) {

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
          this.editor.bus.push(DDeiEnumBusCommandType.ModelChangeValue, { mids: [element.id], paths: paths, value: parsedValue }, null, true);
        });
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-pv-border-dash-combox {
  height: 28px;
  &--disabled .textinput {
    background-color: var(--panel-background);
    height: 28px;
    justify-content: center;
    align-items: center;
  }
  .textinput {
    width: 100%;
    padding-right: 5px;
    border: 0.5px solid var(--panel-border);//var(--panel-header);//darken(var(--panel-header), 13%);
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

    .div_input {
      flex: 1 1 calc(100% - 10px);
      width: calc(100% - 10px);
      height: 3px;
    }

    div {
      flex: 0 0 20px;
    }
  }
}

.icon {
  font-size: 16px
}
</style>
