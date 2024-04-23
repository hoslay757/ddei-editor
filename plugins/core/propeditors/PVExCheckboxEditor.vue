<template>
  <div :class="{ 'ddei_pv_editor_excheckbox': true, 'ddei_pv_editor_excheckbox_disabled': attrDefine.readonly }"
    :style="{ 'pointer-events': attrDefine.readonly ? 'none' : '' }">
    <PVBaseCombox :attrDefine="attrDefine" :searchMethod="doSearch" ref="combox" :canSearch="attrDefine.canSearch">
      <div class="itemboxs"
        :style="{ width: width ? width + 'px' : '', height: height ? height + 'px' : '', 'grid-template-columns': gridTemplateColumns, 'grid-template-rows': gridTemplateRows }">
        <div :style="{ width: attrDefine?.itemStyle?.width + 'px', height: attrDefine?.itemStyle?.height + 'px' }"
          :class="{ 'itembox': true, 'itembox_selected': attrDefine?.value && attrDefine?.value?.indexOf(item.value) != -1, 'itembox_deleted': item.deleted, 'itembox_disabled': item.disabled || (attrDefine?.itemStyle?.maxSelect && attrDefine?.itemStyle?.maxSelect <= attrDefine?.value?.length && attrDefine?.value?.indexOf(item.value) == -1), 'itembox_underline': item.underline, 'itembox_bold': item.bold }"
          v-for="item in dataSource"
          @click="!item.disabled && (!attrDefine?.itemStyle?.maxSelect || attrDefine?.itemStyle?.maxSelect > attrDefine?.value?.length || attrDefine?.value?.indexOf(item.value) != -1) && valueChange(item.value, $event)"
          :title="item.desc">
          <div v-if="item.img" class="itembox_img">
            <img
              :style="{ width: attrDefine?.itemStyle?.imgWidth + 'px', height: attrDefine?.itemStyle?.imgHeight + 'px' }"
              :src="item.img" />
          </div>
          <div class="itembox_text" v-if="item.text" :style="{ 'font-family': item.fontFamily }">{{ item.text }}</div>
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
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";

export default {
  name: "pv-excheckbox",
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
      //临时选择的值
      value: null,
      //已加载的数据源
      dataSource: null,
      width: 0,
      height: 0,
      col: 1,
      gridTemplateColumns: "1fr",
      gridTemplateRows: "",
      searchText: "",
    };
  },
  computed: {},
  components: {
    PVBaseCombox,
  },
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    let itemWidth = this.attrDefine?.itemStyle?.width
      ? this.attrDefine?.itemStyle?.width
      : 100;
    let itemCols = this.attrDefine?.itemStyle?.col
      ? this.attrDefine?.itemStyle?.col
      : 1;
    let itemHeight = this.attrDefine?.itemStyle?.height
      ? this.attrDefine?.itemStyle?.height
      : 30;
    let itemRows = this.attrDefine?.itemStyle?.row
      ? this.attrDefine?.itemStyle?.row
      : 0;
    this.width = (itemWidth + 5) * itemCols + 10;
    this.col = itemCols;
    this.height = (itemHeight + 5) * itemRows;
    let gridTemplateColumns = this.gridTemplateColumns;
    if (this.col > 1) {
      for (let i = 2; i <= this.col; i++) {
        gridTemplateColumns += " 1fr";
      }
      this.gridTemplateColumns = gridTemplateColumns;
    }
    if (itemRows) {
      let gridTemplateRows = "";
      for (let i = 1; i <= itemRows; i++) {
        gridTemplateRows += itemHeight + "px ";
      }
      this.gridTemplateRows = gridTemplateRows;
    }
    this.getDataSource(this.attrDefine);
    let type = this.getDataValue();
    let itemDefine = this.getDataDefine(type.value);
    if (itemDefine?.length > 0) {
      let text = itemDefine[0].text;
      for (let x = 1; x < itemDefine.length; x++) {
        text += "," + itemDefine[x].text;
      }
      this.$refs.combox.text = text;
      if (itemDefine.img) {
        this.$refs.combox.img = itemDefine[0].img;
      }
      this.$refs.combox.value = itemDefine[0].value;
      this.attrDefine.value = type.value;
      this.value = type.value;
    }
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
    /**
     * 根据值获取选项定义
     * @param value 值
     */
    getDataDefine(value) {
      let returnList = [];
      if (this.dataSource && value) {
        for (let i = 0; i < this.dataSource.length; i++) {
          for (let j = 0; j < value.length; j++) {
            if (this.dataSource[i].value.toString() == value[j].toString()) {
              if (returnList.indexOf(this.getDataSource[i]) == -1) {
                returnList.push(this.dataSource[i]);
              }
            }
          }
        }
      }
      return returnList;
    },

    doSearch(text, evt) {
      //过滤dataSource，找到text
      this.searchText = text;
      this.getDataSource(this.attrDefine);
      this.$refs.combox.showDialog(true, evt);
    },

    //获取数据值
    getDataValue() {
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
      //通过解析器获取有效值
      return {
        isDefault: true,
        value: this.attrDefine.getParser().getDefaultValue(),
      };
    },

    valueChange(value, evt) {
      if (this.attrDefine?.readonly) {
        return;
      }
      if (!value) {
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
      if (!this.value) {
        this.value = [];
      }
      let strValue = "" + value;
      if (this.value.indexOf(strValue) == -1) {
        this.value.push(strValue);
      } else {
        let index = this.value.indexOf(strValue);
        if (index != -1) {
          this.value.splice(index, 1);
        }
      }

      this.attrDefine.value = this.value;
      let itemDefine = this.getDataDefine(this.value);
      if (itemDefine?.length > 0) {
        let text = itemDefine[0].text;
        for (let x = 1; x < itemDefine.length; x++) {
          text += "," + itemDefine[x].text;
        }
        this.$refs.combox.text = text;
        if (itemDefine.img) {
          this.$refs.combox.img = itemDefine[0].img;
        }
        this.$refs.combox.value = itemDefine[0].value;
      }
      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let parsedValue = parser.parseValue(this.value);
      //获取属性路径
      let paths = [];
      this.attrDefine?.mapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
      }
      DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, parsedValue);
      this.attrDefine.doCascadeDisplayByValue();
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
          evt,
          true
        );
      } else {
        this.editor.ddInstance.stage.selectedModels.forEach((element) => {
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            {
              mids: [element.id],
              paths: paths,
              value: parsedValue,
              attrDefine: this.attrDefine,
            },
            evt,
            true
          );
        });
      }
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
    /**
     * 获取数据源数据
     */
    getDataSource(attrDefine) {
      let dataSources = DDeiEditorUtil.getDataSource(
        this.editor,
        this.attrDefine,
        this.searchText
      );
      this.dataSource = dataSources;
      return this.dataSource;
    },
  },
};
</script>

<style scoped>
/**以下为combox属性编辑器 */
.ddei_pv_editor_excheckbox {
  margin-top: 4px;
}

.ddei_pv_editor_excheckbox_disabled {}

.ddei-combox-show-dialog_content .itemboxs {
  border-radius: 4px;
  margin-top: 4px;
  display: grid;
  gap: 4px;
  overflow: auto;
  color: black;
  font-size: 13px;
}

.ddei-combox-show-dialog_content .itemboxs .itembox {
  outline: none;
  font-size: 13px;
  margin: auto;
  background: transparent;
  display: table;
  border-radius: 4px;
}

.ddei-combox-show-dialog_content .itemboxs .itembox:hover {
  background-color: rgb(245, 245, 245);
  cursor: pointer;
}

.ddei-combox-show-dialog_content .itemboxs .itembox .itembox_img {
  display: table-cell;
  padding-left: 5px;
  vertical-align: middle;
}

.ddei-combox-show-dialog_content .itemboxs .itembox .itembox_img img {
  text-align: center;
  vertical-align: middle;
}

.ddei-combox-show-dialog_content .itemboxs .itembox .itembox_text {
  text-align: center;
  display: table-cell;
  width: 100%;
  vertical-align: middle;
}

.ddei-combox-show-dialog_content .itembox_selected {
  border: 1px solid #017fff;
  overflow: hidden;
  position: relative;
}

.ddei-combox-show-dialog_content .itembox_selected::before {
  position: absolute;
  content: "";
  -webkit-font-smoothing: antialiased;
  background-color: #017fff;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  right: -8px;
  bottom: -8px;
  width: 15px;
  height: 15px;
}

.ddei-combox-show-dialog_content .itembox_selected::after {
  font-size: 12px;
  line-height: 12px;
  right: -3px;
  bottom: -2px;
  position: absolute;
  -webkit-font-smoothing: antialiased;
  content: "✓";
  -webkit-transform: scale(0.5);
  -ms-transform: scale(0.5);
  transform: scale(0.5);
  color: #fff;
}

.ddei-combox-show-dialog_content .itembox_deleted {
  text-decoration: line-through;
}

.ddei-combox-show-dialog_content .itembox_disabled {
  color: rgb(210, 210, 210);
}

.ddei-combox-show-dialog_content .itembox_disabled:hover {
  cursor: not-allowed !important;
}

.ddei-combox-show-dialog_content .itembox_underline {
  text-decoration: underline;
}

.ddei-combox-show-dialog_content .itembox_bold .itembox_text {
  font-weight: bold;
}
</style>
