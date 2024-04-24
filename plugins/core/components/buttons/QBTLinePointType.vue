<template>
  <div
    :class="{ 'ddei_pv_line_point_combox': true, 'ddei_pv_line_point_combox_disabled': !attrDefine || attrDefine.readonly }">
    <div class="textinput" @click="attrDefine && !attrDefine.readonly && showDialog($event)">
      <div class="div_input">
        {{ text }}
      </div>
      <div style="display:flex;justify-content: center;align-items: center;">
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
import {DDeiEditorUtil} from 'ddei-framework';
export default {
  name: "ddei-core-btn-linepointtype",
  extends: null,
  mixins: [],
  components: {
  },
  props: {
    attrCode: {
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
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      controlDefine: null,
      attrDefine: null,
      value: null,
      text: ""
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
    refreshText() {
      let text = ""
      if (this.attrDefine?.dataSource) {

        for (let i = 0; i < this.attrDefine.dataSource.length; i++) {
          if (this.attrDefine.dataSource[i].value == this.value) {
            text = this.attrDefine.dataSource[i].text
            break;
          }
        }

      }
      this.text = text
    },
    refreshEditor() {
      if (this.editor?.currentControlDefine) {
        this.controlDefine = this.editor.currentControlDefine;
        if (this.controlDefine) {
          this.attrDefine = this.controlDefine.attrDefineMap.get(this.attrCode);
          let valueDefine = this.getDataValue();
          if (valueDefine && !valueDefine.isDefault) {
            this.value = valueDefine.value;
          }

        } else {
          this.attrDefine = null
        }
      }
      this.refreshText();
    },

    //打开弹出框
    showDialog(evt) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-linepointtype", {

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
      if (!hasEditSetted) {
        this.editor.ddInstance.stage.selectedModels.forEach(element => {
          this.editor.bus.push(DDeiEnumBusCommandType.ModelChangeValue, { mids: [element.id], paths: paths, value: parsedValue }, null, true);
        });
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
      this.refreshText();
    }
  }
};
</script>

<style lang="less" scoped>
.ddei_pv_line_point_combox {
  height: 28px;
}

.ddei_pv_line_point_combox_disabled .textinput {
  background-color: var(--panel-background);
  height: 28px;
  justify-content: center;
  align-items: center;
}

.ddei_pv_line_point_combox .textinput {
  width: 100%;
  padding-right: 5px;
  border: 0.5px solid var(--panel-border);//darken(var(--panel-header), 13%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  height: 28px;
}

.ddei_pv_line_point_combox .textinput:hover {
  border: 1px solid var(--dot);
  box-sizing: border-box;
}

.ddei_pv_line_point_combox .textinput {
  .div_input {
    flex: 1 1 calc(100% - 10px);
    width: calc(100% - 10px);
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.ddei_pv_line_point_combox .textinput div {
  flex: 0 0 20px;
}


.icon {
  font-size: 16px
}
</style>
