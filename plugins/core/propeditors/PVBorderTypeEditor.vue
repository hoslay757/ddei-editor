<template>
  <div :class="{ 'ddei_pv_editor_bordertype': true, 'ddei_pv_editor_bordertype_disabled': attrDefine.readonly }"
    :style="{ 'pointer-events': attrDefine.readonly ? 'none' : '' }">
    <div class="itembox" v-for="item in dataSource" @click="checkRadioValue(attrDefine, $event)">
      <input type="radio" :disabled="attrDefine.readonly" :name="attrDefine.id" :value="item.value" autocomplete="off"
        v-model="attrDefine.value" />
      <div>{{ item.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework1";
import {DDeiEditor} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiAbstractArrtibuteParser } from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";
import {DDeiEnumOperateType} from "ddei-framework1";

export default {
  name: "pv-border-type",
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
  },
  data() {
    return {
      //当前编辑器
      editor: null,
      dataSource: null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.getDataSource(this.attrDefine);
    let type = this.getTypeValue();
    if (type) {
      this.attrDefine.value = type.value;
      this.showOrHiddenOtherAttrs(this.attrDefine.value);
    }

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
      if (this.dataSource && value) {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].value.toString() == value.toString()) {
            return this.dataSource[i];
          }
        }
      }
      return { text: "" };
    },
    /**
     * 选中radio
     */
    checkRadioValue(attrDefine, evt: Event) {
      let targetElement = evt.target;
      if (
        targetElement.tagName == "DIV" &&
        targetElement.className == "itembox"
      ) {
        targetElement = targetElement.children[0];
      } else if (targetElement.tagName == "DIV") {
        targetElement = targetElement.parentElement.children[0];
      }
      if (attrDefine.value == targetElement.value) {
        attrDefine.value = null;
      } else {
        attrDefine.value = targetElement.value;
      }
      this.valueChange();
    },

    /**
     * 获取数据源数据
     */
    getDataSource(attrDefine) {
      let dataSources = DDeiEditorUtil.getDataSource(this.editor, this.attrDefine);
      this.dataSource = dataSources;
      return this.dataSource;
    },

    showOrHiddenOtherAttrs(value) {
      //显示隐藏其他属性
      if (value == "0") {
        this.controlDefine.groups.forEach(group => {
          DDeiEditorArrtibute.hiddenAttributesByCode(
            group,
            "border.color",
            "borderOpacity",
            "borderWidth",
            "borderDash",
            "borderRound",
          );
        });

      } else if (value == "1") {
        this.controlDefine.groups.forEach(group => {
          DDeiEditorArrtibute.showAttributesByCode(
            group,
            "border.color",
            "borderOpacity",
            "borderWidth",
            "borderDash",
            "borderRound",
          );
        });
      }
    },

    getTypeValue() {
      //获取属性路径
      let paths = [];
      this.attrDefine?.exmapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
      }

      //通过解析器获取有效值
      let value = DDeiUtil.getDataByPathList(this.attrDefine.model, paths);
      if (!value) {
        return { value: "1" };
      } else if (value == "true" || value == true) {
        return { value: "0" };
      }
      return {
        isDefault: true,
        value: this.attrDefine.getParser().getDefaultValue(),
      };
    },

    valueChange(evt) {
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
      //获取属性路径
      let paths = [];
      this.attrDefine?.exmapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
      }

      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let value = parser.parseValue(this.attrDefine.value);
      //显示隐藏其他属性
      this.showOrHiddenOtherAttrs(value);
      //设置当前编辑器控件的临时属性值
      this.editor.ddInstance.stage.selectedModels.forEach((element) => {
        if (value == "0") {
          //推送信息进入总线
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            {
              mids: [element.id],
              paths: paths,
              value: true,
              attrDefine: this.attrDefine,
            },
            evt,
            true
          );
          //根据code以及mapping设置属性值
          DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, true);
        }
        //处理实线
        else if (value == "1") {
          //推送信息进入总线
          this.editor.bus.push(
            DDeiEnumBusCommandType.ModelChangeValue,
            {
              mids: [element.id],
              paths: paths,
              value: false,
              attrDefine: this.attrDefine,
            },
            evt,
            true
          );
          //根据code以及mapping设置属性值
          DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, false);
        }
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
/**以下为radio属性编辑器 */
.ddei_pv_editor_bordertype {
  border-radius: 4px;
  margin-right: 10px;

}

.ddei_pv_editor_bordertype_disabled {
  background-color: rgb(210, 210, 210) !important;
}

.ddei_pv_editor_bordertype .itembox {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 24px;
  outline: none;
  font-size: 15px;
  margin: 0;
  padding-top: 2px;
  background: transparent;
}

.ddei_pv_editor_bordertype .itembox input {
  width: 16px;
  height: 16px;
}

.ddei_pv_editor_bordertype .itembox div {
  margin-left: 15px;
}

.ddei-editor-pv-subgroup-view-tab-panel-editors-row .itembox {
  float: left;
  margin-right: 10px;
}

.ddei-editor-pv-subgroup-view-tab-panel-editors-column .itembox {
  margin-top: 10px;
}

.ddei-editor-pv-subgroup-view-tab-panel-editors-row .itembox div {
  float: left;
  margin-left: 5px;
}
</style>
