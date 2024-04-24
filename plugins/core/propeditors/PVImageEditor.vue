<template>
  <div :class="{ 'ddei-pv-editor-image': true, 'ddei-pv-editor-image--disabled': attrDefine.readonly }">
    <div class="textinput">
      <input type="text" v-model="attrDefine.value" :disabled="attrDefine.readonly"
        :placeholder="attrDefine.defaultValue" :name="'ddei-pv-editor-image-' + attrDefine.code" autocomplete="off" />

      <svg @click="attrDefine && !attrDefine.readonly && chooseFile()" class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan389"></use>
      </svg>


    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiAbstractArrtibuteParser } from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
export default {
  name: "pv-image",
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
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
  },
  computed: {},
  watch: {},
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("attrDefine.value", function (newVal, oldVal) {
      this.valueChange();
    });
  },
  mounted() {
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

    async chooseFile() {
      const arrFileHandle = await showOpenFilePicker({
        types: [{
          accept: {
            'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
          }
        }]
      })
      //获取图片数据  这个file其实就是和input元素<input type="file" id="file">，document.querySelector("#file").files[0]一样
      let file = await arrFileHandle[0].getFile();
      //转成base64
      let read = new FileReader();
      read.readAsDataURL(file);
      read.onload = () => {
        //创建img，插入页面中
        let result = read.result;
        if (result.indexOf("data:image") != -1) {
          this.attrDefine.value = result
        }
      }

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
      this.attrDefine?.mapping?.forEach((element) => {
        paths.push(element);
      });
      if (!(paths?.length > 0)) {
        paths = [this.attrDefine.code];
      }

      //通过解析器获取有效值
      let parser: DDeiAbstractArrtibuteParser = this.attrDefine.getParser();
      //属性值
      let value = parser.parseValue(this.attrDefine.value);
      DDeiUtil.setAttrValueByPath(this.attrDefine.model, paths, value);
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
          //清空图片
          if (element.render) {
            element.render.imgObj = null
          }
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
  },
};
</script>

<style scoped>
/**以下为range属性编辑器 */
.ddei-pv-editor-image {
  border-radius: 4px;
  height: 28px;
  margin-right: 10px;
}


.ddei-pv-editor-image .textinput {
  width: 100%;
  height: 28px;
  padding-left: 5px;
  padding-right: 5px;
  border: 0.5px solid var(--panel-title);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ddei-pv-editor-image .textinput:hover {
  border: 1px solid var(--dot);
  box-sizing: border-box;
}

.ddei-pv-editor-image--disabled .textinput {
  width: 100%;
  height: 28px;
  padding-left: 5px;
  padding-right: 5px;
  border: 0.5px solid var(--panel-disabled);
  border-radius: 4px;
  display: flex;
  background-color: var(--panel-disabled);
  justify-content: center;
  align-items: center;
}

.ddei-pv-editor-image--disabled .textinput:hover {
  border: 1px solid var(--panel-disabled) !important;
  box-sizing: border-box;
}

.ddei-pv-editor-image .textinput input {
  flex: 1 1 calc(100% - 20px);
  width: calc(100% - 20px);
  border: transparent;
  outline: none;
  color:var(--panel-title);
  font-size: 16px;
  margin: 0px 2%;
  background: transparent;
}

.ddei-pv-editor-image .textinput .icon {
  flex: 0 0 20px;
  font-size: 16px
}

.ddei-pv-editor-image .textinput .icon:hover {
  cursor: pointer;
  background: var(--panel-hover);
}


.textinput .fileinput {
  display: none;
}
</style>
