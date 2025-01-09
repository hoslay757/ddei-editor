<template>
  <div @touchstart="changeEditorFocus" v-if="forceRefresh" ref="propertyview"
    class="ddei-core-panel-propertyview-mobile">
    <div class="content" ref="content">
      <div v-for="item in options?.items" style="display: contents;">
        <div class="row"
          v-if="!item.viewer && item.id == 'ddei-mobile-property-editor-text' && validItemCondition(item)">
          <div class="change-property-text" :title="item.desc">
            <div class="change-property-text-title">
              {{ editor.i18n(item.label) }}
            </div>
            <div :class="{'change-property-text-input':true,'readonly':readonly}">
              <input v-model="model[item.property]" :readonly="readonly"
                @change="modelChangeProperty(model, item.property)" :placeholder="editor.i18n(item.desc)">
            </div>
          </div>
        </div>

        <div class="row"
          v-if="!item.viewer && item.id == 'ddei-mobile-property-editor-textarea' && validItemCondition(item)">
          <div class="change-property-textarea" :title="item.desc">
            <div class="change-property-textarea-title">
              {{ editor.i18n(item.label) }}
            </div>
            <div :class="{ 'change-property-textarea-input': true, 'readonly': readonly }">
              <textarea v-model="model[item.property]" :readonly="readonly"
                @change="modelChangeProperty(model, item.property)" :placeholder="editor.i18n(item.desc)"></textarea>
            </div>
          </div>
        </div>

        <div class="row"
          v-if="!item.viewer && item.id == 'ddei-mobile-stage-editor-text' && file && validItemCondition(item)">
          <div class="change-property-text" :title="item.desc">
            <div class="change-property-text-title">
              {{ editor.i18n(item.label) }}
            </div>
            <div :class="{ 'change-property-text-input': true, 'readonly': readonly }">
              <input v-model="file[item.property]" :readonly="readonly"
                @change="modelChangeProperty(model, item.property)" :placeholder="editor.i18n(item.desc)">
            </div>
          </div>
        </div>

        <div class="row"
          v-if="!item.viewer && item.id == 'ddei-mobile-stage-editor-textarea' && file && validItemCondition(item)">
          <div class="change-property-textarea" :title="item.desc">
            <div class="change-property-textarea-title">
              {{ editor.i18n(item.label) }}
            </div>
            <div :class="{ 'change-property-textarea-input': true, 'readonly': readonly }">
              <textarea v-model="file[item.property]" :readonly="readonly"
                @change="modelChangeProperty(model, item.property)" :placeholder="editor.i18n(item.desc)"></textarea>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="!readonly && !item.viewer && item.id == 'ddei-mobile-remove' && file && validItemCondition(item)">
          <div class="remove-button" @click="removeControl">
            {{ editor.i18n(item.label) }}
          </div>
        </div>
        <component v-if="item.viewer && validItemCondition(item)" :is="item.viewer" :editor="editor" :options="options"
          :model="model" v-bind="item">
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import { Matrix3 } from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import { clone } from 'ddei-framework'
import {DDeiEnumOperateState} from "ddei-framework";

export default {
  name: "ddei-core-panel-propertyview-mobile",
  extends: null,
  mixins: [],
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
  },
  data() {
    return {
      model: null,
      file:null,
      sheet:null,
      stage:null,
      readonly:0,
      forceRefresh: true,
    };
  },
  computed: {},
  watch: {},
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("editor.ddInstance.stage.selectedModels", this.refreshData);
  },
  mounted() {
    
    this.refreshData()
    // 获取要监听的 div 元素
    let middleCanvas = document.getElementById(this.editor.id + "_canvas");
    // 创建 ResizeObserver 实例
    const resizeObserver1 = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        const { width, height } = entry.contentRect;
        if (width != 0 && height != 0) {

          //横向
          if (DDeiUtil.isLandscape()) {
            this.$refs['content'].setAttribute("class", "content content-landspace");
          }
          //纵向
          else {
            this.$refs['content'].setAttribute("class", "content")
          }
        }

      }
    });

    //开始监听目标元素的大小变化
    resizeObserver1.observe(middleCanvas);
  },
  methods: {
    
    modelChangeProperty(model, property) {
      if (!model || !property) {
        return;
      }
      let mds = [model];
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
      let paths = [property];


      //推送信息进入总线
      this.editor.bus.push(
        DDeiEnumBusCommandType.ModelChangeValue,
        {
          mids: [model.id],
          paths: paths,
          value: model[property]
        },
        null,
        true
      );


      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
        parts: ["topmenu"],
      });
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
      //编辑完成后的回调函数
      DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_AFTER", DDeiEnumOperateType.EDIT, { models: mds, propName: this.attrDefine?.code }, this.editor.ddInstance, null)
    },

    removeControl(){
      if(this.model){
        this.model.layer.opPoints = [];

        if (this.model.layer.opLine?.render) {
          this.model.layer.opLine.render.enableRefreshShape()
        }
        delete this.model.layer.opLine;
        this.editor.ddInstance.stage.removeModel(this.model,true)
      }
    },

    validItemCondition(item) {
      if (!item.condition) {
        return true;
      } else {
        let func = new Function("model", "item", "editor", "component", "return " + item.condition)
        let rs = func(this.model, item, this.editor, this)
        return rs
      }
    },

    refreshData() {
      this.file = this.editor.files[this.editor.currentFileIndex];
      this.sheet = this.file[this.file.currentSheetIndex];
      this.stage = this.editor.ddInstance.stage
      if (this.editor.ddInstance.stage.selectedModels?.size > 0){
        this.model = Array.from(this.editor.ddInstance.stage.selectedModels.values())[0];
        let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: [this.model] }, this.editor.ddInstance)
        this.readonly = rsState == -1
      }else{
        this.model = null
        let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: [this.stage] }, this.editor.ddInstance)
        this.readonly = rsState == -1
      }
      //横向
      if (this.$refs['content']){
        if (DDeiUtil.isLandscape()) {
          this.$refs['content'].setAttribute("class", "content content-landspace");
        }
        //纵向
        else {
          this.$refs['content'].setAttribute("class", "content")
        }
      }
    },

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'property' || parts.indexOf('property') != -1) {
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData()
          }
        });
      }
    },
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    }
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-propertyview-mobile {
  text-align: center;
  border: 1px solid var(--panel-border);
  overflow: hidden;
  background-color: var(--panel-background);
  display: flex;
  justify-content: start;
  align-items: center;

  .readonly{
    > input,textarea{
      color:grey !important;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    .row {
      flex: 0 1 20px;
      margin: 5px;
      width: 100%;

      .icon {
        opacity: 0.5;
        &:hover {
          opacity: 1.0;
        }
      }

      .remove-button{
        height: 26px;
        text-align: center;
        border-radius: 2px;
        font-size: 18px;
        margin-left:25px;
        color:white;
        width: calc(100% - 40px);
        background: red;
      }

      .change-property-text {
        height: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-title {
          flex: 0 0 100px;
          color: black;
          font-size: 16px;
        }

        &-input {
          flex: 1;
          color: black;
          
          text-align: left;

          input {
            font-size: 16px;
            width: 95%;
            height: auto;
            color: black;

            &::placeholder {
              color: grey;

            }
          }
        }

      }


      .change-property-textarea {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-title {
          flex: 0 0 100px;
          color: black;
          font-size: 16px;
        }

        &-input {
          flex: 1;
          color: black;
          
          text-align: left;

          textarea {
            background: white;
            color: black;
            font-size: 16px;
            &::placeholder {
              color: grey;
            }

            width: 95%;
            height: 55px;
          }
        }

      }
    }
  }

  .content-landspace{
    .row{
      margin: 2px 5px;

      .remove-button {
        margin-left: 20px;
      }
      
      .change-property-text {
        height: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        &-title {
          flex: 1;
          width:100%;
          padding-left:10px;
          text-align: left;
        }
      
        &-input {
          flex: 1;
          text-align: right;
          width:100%;
          padding:0 20px;
          input {
            width: 100%;
          }
        }
      }
      .change-property-textarea {
        height: auto;
        width: 100%;
        display: flex;
        flex-direction: column;

        &-title {
          flex: 1;
          width: 100%;
          padding-left: 10px;
          text-align: left;
        }

        &-input {
          flex: 1;
          text-align: right;
          width: 100%;
          padding: 0 20px;

          textarea {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
