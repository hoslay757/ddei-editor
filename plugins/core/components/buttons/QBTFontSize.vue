<template>
  <div>
    <div id="ddei-editor-quick-fat-item-fontsize"
      :class="{ 'ddei-editor-quick-fat-item-fontsize': true, 'ddei-editor-quick-fat-item-fontsize--disabled': !attrDefine }">
      <input class="ddei-editor-quick-fat-item-fontsize_input"
        :readonly="!attrDefine || (attrDefine && (attrDefine.readonly))" v-model="text" @input="inputValue()"
        :placeholder="defaultText" autocomplete="off" />
      <div class="ddei-editor-quick-fat-item-fontsize_combox"
        @click="attrDefine && !attrDefine.readonly && showDialog($event)">
        <svg class="icon iconfont-45" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan478"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEnumOperateState} from "ddei-framework1";
import {DDeiModelArrtibuteValue} from "ddei-framework1";

export default {
  name: "ddei-core-btn-fontsize",
  extends: null,
  mixins: [],
  components: {},
  props: {
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
      dataSource: null,
      value: null,
      text: null,
      defaultText: null,
      expanded: false,
      canSearch: true,
    };
  },
  computed: {},
  watch: {},
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
    this.refreshEditor();
  },
  methods: {

    refreshEditor() {
      if (this.editor?.currentControlDefine) {
        this.controlDefine = this.editor.currentControlDefine;
        if (this.controlDefine) {
          this.attrDefine = this.controlDefine.attrDefineMap.get("font.size");
        } else {
          this.attrDefine = null;
        }
        if (this.attrDefine) {
          this.getDataSource(this.attrDefine);
          let type = this.getDataValue()

          let define = this.getDataDefine(type.value);
          if (!type.isDefault) {
            this.attrDefine.value = type.value;
            this.text = define.text;
          } else {
            this.defaultText = define.text;
          }
          if (this.attrDefine.value) {
            this.value = this.attrDefine.value;
            this.text = this.attrDefine.value;
          } else {
            this.value = type.value;
          }
        }
      }
    },

    inputValue(value) {
      //过滤dataSource，找到text
      let dialogSet = false;
      if (value) {
        dialogSet = true
        this.attrDefine.value = value;
        let itemDefine = this.getDataDefine(value);
        let text = itemDefine.text;
        this.text = text;
        this.value = value;
      } else {
        value = this.text;
        this.attrDefine.value = value;
        this.value = value;
        let itemDefine = this.getDataDefine(value);
        if (itemDefine?.text) {
          this.text = itemDefine.text;
        }
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
      let parsedValue = parser.parseValue(value);
      parsedValue = isNaN(parsedValue) || parsedValue <= 0 ? null : parsedValue
      parsedValue = parsedValue > 300 ? 300 : parsedValue
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
            if (dialogSet) {
              setTimeout(() => {
                editorText.focus();
              }, 20);
            }
            hasEditSetted = true;
          }
        }
      }
      if (!hasEditSetted) {
        this.editor.ddInstance.stage.selectedModels.forEach((element) => {
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            { mids: [element.id], paths: paths, value: parsedValue },
            null,
            true
          );
        });
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
    },


    //打开弹出框
    showDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog("ddei-core-dialog-selectfontsize", {
        dataSource: this.dataSource,
        value: this.attrDefine.value,
        group: "property-dialog",
        callback: {
          ok: this.inputValue
        }
      }, { type: 5 }, srcElement, false, true)
    },
    /**
     * 根据值获取选项定义
     * @param value 值
     */
    getDataDefine(value) {
      if (this.dataSource && value) {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].value.toString() == value.toString()) {
            return this.dataSource[i];
          }
        }
      }
      return { text: "" };
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
                return { isDefault: true, value: value };
              } else {
                return { value: value };
              }
            }
          }
        }

        let dataValue = this.attrDefine.value;
        if (!dataValue) {
          dataValue = DDeiUtil.getDataByPathList(
            this.attrDefine.model,
            this.attrDefine.code,
            this.attrDefine.mapping
          );
        }
        if (dataValue) {
          return { value: dataValue };
        }

      }
      //通过解析器获取有效值
      return {
        isDefault: true,
        value: this.attrDefine?.getParser().getDefaultValue(),
      };
    },

    /**
     * 获取数据源数据
     */
    getDataSource(attrDefine) {
      if (this.attrDefine) {
        this.attrDefine.dataSource = [
          { text: "9", value: 9 },
          { text: "10", value: 10 },
          { text: "10.5", value: 10.5 },
          { text: "11", value: 11 },
          { text: "12", value: 12 },
          { text: "13", value: 13 },
          { text: "14", value: 14 },
          { text: "18", value: 18 },
          { text: "24", value: 24 },
          { text: "36", value: 36 },
          { text: "48", value: 48 },
          { text: "64", value: 64 },
          { text: "72", value: 72 },
          { text: "96", value: 96 },
          { text: "144", value: 144 },
          { text: "288", value: 288 },
        ];
        let dataSources = DDeiEditorUtil.getDataSource(
          this.editor,
          this.attrDefine,
          this.searchText
        );
        this.dataSource = dataSources;
        return this.dataSource;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/*字体大小设置框 */

.ddei-editor-quick-fat-item-fontsize {
  background-color: var(--panel-background);
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

  &:hover {
    border: 0.5px solid var(--dot);
    box-sizing: border-box;
  }

  &--disabled:hover {
    background-color: var(--panel-disabled);
    cursor: not-allowed !important;
  }

  &_input {
    width: calc(100% - 20px);
    border: transparent;
    outline: none;
    color:var(--panel-title);
    font-size: 15px;
    background: transparent;
  
  }

  &_combox {
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  
    .iconfont-45 {
      font-size: 13px
    }
  }
}

.ddei-editor-quick-fat-item-box {
  width: 25px;
  height: 25px;
  text-align: center;


  &--disabled {
    color: var(--panel-title-disabled);
    filter: brightness(200%) !important;
  }

  &--disabled:hover {
    background-color: var(--panel-disabled);
    cursor: not-allowed;
  }

  &:hover {
    background-color: var(--panel-hover);
    border-radius: 4px;
  }
}


</style>
