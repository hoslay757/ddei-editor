<template>
  <div v-if="forceRefresh" class="ddei-core-panel-topmenu" @mousedown="changeEditorFocus">
    <div class="ddei-core-panel-topmenu-quickbox">
      <component :editor="editor" v-for="(item, index) in editor?.getPartPanels(options, 'panels') " :is="item.comp"
        :options="item.options" v-bind="item.options"></component>
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";

export default {
  name: "ddei-core-panel-topmenu",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
    ,editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      file: null,
      forceRefresh:true,
    };
  },
  //注册组件
  components: {
   
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData()
  },
  methods: {

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'topmenu' || parts.indexOf('topmenu') != -1) {
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
      this.editor.topMenuViewer = this;
      let file = this.editor?.files[this.editor?.currentFileIndex];
      this.file = file
    },
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      if (this.editor.state != DDeiEditorState.TOP_MENU_OPERATING && this.editor.state != DDeiEditorState.QUICK_EDITING) {
        this.editor.changeState(DDeiEditorState.TOP_MENU_OPERATING);
      }
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    },
  },
};
</script>

<style lang="less" scoped>

.ddei-core-panel-topmenu {
  background: var(--topmenu-background);
  &-quickbox {
    background-color: var(--topmenu-header);
    width: 100%;
    height: 103px;
    display: flex;
  }
}
</style>
