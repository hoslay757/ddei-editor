<template>
  <div class="ddei-core-panel-bottommenu" v-if="forceRefresh" @mousedown="changeEditorFocus">
    <component :editor="editor" v-for="(item, index) in editor?.getPartPanels(options, 'panels') " :is="item.comp"
      :options="item.options" v-bind="item.options"></component>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";


export default {
  name: "ddei-core-panel-bottommenu",
  extends: null,
  mixins: [],
  props: {
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
      forceRefresh:true,
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'bottommenu' || parts.indexOf('bottommenu') != -1) {
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData();
          }
        });
      }
    },

    refreshData() {
      //获取编辑器
      this.editor.bottomMenuViewer = this;
    },
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      if (this.editor.state != DDeiEditorState.BOTTOM_MENU_OPERATING && this.editor.state != DDeiEditorState.QUICK_EDITING) {
        this.editor.changeState(DDeiEditorState.BOTTOM_MENU_OPERATING);
      }
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    },
  },
};
</script>

<style lang="less" scoped>

.ddei-core-panel-bottommenu {
  height:30px;
  display: flex;
  color: var(--text);
  background: var(--background);
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
