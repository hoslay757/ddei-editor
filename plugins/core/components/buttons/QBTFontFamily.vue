<template>
  <div>
    <div id="ddei-editor-quick-fat-item-fontfamily"
      :class="{ 'ddei-editor-quick-fat-item-fontfamily': true, 'ddei-editor-quick-fat-item-fontfamily--disabled': !attrDefine }">
      <input class="ddei-editor-quick-fat-item-fontfamily_input"
        :readonly="!attrDefine || (attrDefine && (attrDefine.readonly || !canSearch))" v-model="text"
        :placeholder="defaultText" @click="attrDefine && !attrDefine.readonly && !canSearch && showDialog($event)"
        @keydown="search($event)" autocomplete="off" />
      <div class="ddei-editor-quick-fat-item-fontfamily_combox"
        @click="attrDefine && !attrDefine.readonly && showDialog($event)">
        <svg class="icon iconfont-45" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan478"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from "lodash";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";
import { DDeiModelArrtibuteValue, DDeiEnumOperateType } from "ddei-framework";

export default {
  name: "ddei-core-btn-fontfamily",
  extends: null,
  mixins: [],
  components: {},
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
     editor: {
      type: DDeiEditor,
      default: null,
    },
    controlDefine:{
      type:Object,
      default:null,
    }
  },
  data() {
    return {
      attrDefine: null,
      dataSource: null,
      value: null,
      text: null,
      defaultText: null,
      expanded: false,
      canSearch: true
    };
  },
  computed: {},
  watch: {},
  created() {
    // 搜索框防抖
    this.search = debounce(this.search, 200);
    // 监听obj对象中prop属性的变化
    this.$watch("editor.textEditorSelectedChange", function (newVal, oldVal) {
      if (newVal) {
        this.refreshEditor();
      }
    });
  },
  mounted() {
    this.refreshEditor();
  },
  methods: {

    refreshEditor() {
      
      if (this.controlDefine) {
        let attrD = this.controlDefine.attrDefineMap.get("font.family");
        let mds = []
        if (this.editor.ddInstance.stage.selectedModels?.size > 0){
          mds = Array.from(this.editor.ddInstance.stage.selectedModels.values())
        }
        let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: mds, propName: attrD?.code }, this.editor.ddInstance)
        if (rsState != -1){
          this.attrDefine = attrD
        }
        
      } else {
        this.attrDefine = null;
      }

      this.getDataSource(this.attrDefine);
      let type = this.getDataValue();
      let define = this.getDataDefine(type.value);
      if (!type.isDefault) {
        this.attrDefine.value = type.value;
        this.text = define.text;
        if (define.img) {
          this.$refs.combox.img = define.img;
        }
      } else {
        this.defaultText = define.text;
      }
      this.value = type.value;
      
    },


    search() {
      //过滤dataSource，找到text
      this.searchText = this.text;
      this.getDataSource(this.attrDefine);
      this.showDialog();
    },

    //打开弹出框
    showDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-selectfont", {
        dataSource: this.dataSource,
        value: this.attrDefine.value,
        group: "property-dialog",
        callback: {
          ok: this.valueChange
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
              }
              return { value: value };
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
        let dataSources = DDeiEditorUtil.getDataSource(
          this.editor,
          this.attrDefine,
          this.searchText
        );
        this.dataSource = dataSources;
        return this.dataSource;
      }
    },

    valueChange(value, evt) {
      this.attrDefine.value = value;
      let itemDefine = this.getDataDefine(value);
      let text = itemDefine.text;
      this.text = text;
      this.value = value;
      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let parsedValue = parser.parseValue(value);
      //获取属性路径
      let paths = [];
      this.attrDefine?.mapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
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
        this.editor.ddInstance.stage.selectedModels.forEach((element) => {
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            { mids: [element.id], paths: paths, value: parsedValue },
            evt,
            true
          );
        });
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
      this.editor.bus.executeAll();
    },

  },
};
</script>

<style lang="less" scoped>
/*字体选择框*/

.ddei-editor-quick-fat-item-fontfamily {
  background-color: var(--panel-background);
  height: 24px;
  display: flex;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  border-right: none;

  &:hover {
    border: 0.5px solid var(--dot);
    box-sizing: border-box;
  }

  &--disabled{
    &:hover {
      background-color: var(--panel-disabled);
      cursor: not-allowed !important;
    }
  }

  &_input {
    width: calc(100% - 20px);
    border: transparent;
    outline: none;
    font-size: 15px;
    color:var(--panel-title);
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
</style>
