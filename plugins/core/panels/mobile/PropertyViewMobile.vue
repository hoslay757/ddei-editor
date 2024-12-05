<template>
  <div @touchstart="changeEditorFocus" v-if="forceRefresh" ref="propertyview" class="ddei-core-panel-propertyview-mobile">
    
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
      forceRefresh: true,
    };
  },
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    

    refreshData() {
      

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
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 5px;
  overflow: hidden;
  background-color: red;//var(--panel-background);
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
